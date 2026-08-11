"""ML-based security classifier for AIShield Defender.

This module provides a TF-IDF + Logistic Regression classifier for
detecting malicious prompts. It operates independently of any LLM or
rule-based components.
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import Tuple, Union, List, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.model_selection import train_test_split


class PromptSecurityClassifier:
    """TF-IDF + Logistic Regression classifier for prompt security.

    Attributes:
        vectorizer: TF-IDF vectorizer fitted on training data.
        classifier: Logistic Regression model fitted on vectorized training data.
        classes_: array of class labels (0: BENIGN, 1: MALICIOUS).
    """

    def __init__(
        self,
        max_features: int = 10000,
        ngram_range: Tuple[int, int] = (1, 2),
        lowercase: bool = True,
        random_state: int = 42,
        max_iter: int = 1000,
    ):
        """Initialize the classifier.

        Args:
            max_features: Maximum number of features for TF-IDF.
            ngram_range: Range of n-grams to consider for TF-IDF.
            lowercase: Whether to convert text to lowercase.
            random_state: Random seed for reproducibility.
            max_iter: Maximum iterations for Logistic Regression solver.
        """
        self.vectorizer = TfidfVectorizer(
            max_features=max_features,
            ngram_range=ngram_range,
            lowercase=lowercase,
        )
        self.classifier = LogisticRegression(
            random_state=random_state,
            max_iter=max_iter,
        )
        self.classes_ = np.array([0, 1])  # 0: BENIGN, 1: MALICIOUS

    def train(self, texts: Union[List[str], pd.Series], labels: Union[List[int], pd.Series]) -> None:
        """Train the classifier on the provided data.

        Args:
            texts: List or series of input texts.
            labels: List or series of binary labels (0 for BENIGN, 1 for MALICIOUS).
        """
        # Convert to numpy arrays if needed
        if isinstance(texts, pd.Series):
            texts = texts.values
        if isinstance(labels, pd.Series):
            labels = labels.values

        # Fit TF-IDF on the training texts
        X = self.vectorizer.fit_transform(texts)
        # Train Logistic Regression
        self.classifier.fit(X, labels)

    def predict(self, texts: Union[List[str], pd.Series]) -> np.ndarray:
        """Predict class labels for the provided texts.

        Args:
            texts: List or series of input texts.

        Returns:
            Array of predicted class labels (0 or 1).
        """
        if isinstance(texts, pd.Series):
            texts = texts.values
        X = self.vectorizer.transform(texts)
        return self.classifier.predict(X)

    def predict_proba(self, texts: Union[List[str], pd.Series]) -> np.ndarray:
        """Predict class probabilities for the provided texts.

        Args:
            texts: List or series of input texts.

        Returns:
            Array of shape (n_samples, 2) with probabilities for each class.
        """
        if isinstance(texts, pd.Series):
            texts = texts.values
        X = self.vectorizer.transform(texts)
        return self.classifier.predict_proba(X)

    def evaluate(
        self, texts: Union[List[str], pd.Series], labels: Union[List[int], pd.Series]
    ) -> dict:
        """Evaluate the classifier on the provided data.

        Args:
            texts: List or series of input texts.
            labels: List or series of binary labels.

        Returns:
            Dictionary containing accuracy, precision, recall, f1, and confusion matrix.
        """
        if isinstance(texts, pd.Series):
            texts = texts.values
        if isinstance(labels, pd.Series):
            labels = labels.values

        predictions = self.predict(texts)
        probas = self.predict_proba(texts)

        accuracy = accuracy_score(labels, predictions)
        precision = precision_score(labels, predictions, zero_division=0)
        recall = recall_score(labels, predictions, zero_division=0)
        f1 = f1_score(labels, predictions, zero_division=0)
        cm = confusion_matrix(labels, predictions)

        return {
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1": f1,
            "confusion_matrix": cm,
        }

    def save(self, directory: str, filename: str = "prompt_security_classifier.joblib") -> str:
        """Save the vectorizer and classifier to disk.

        Args:
            directory: Directory to save the file.
            filename: Name of the file.

        Returns:
            Full path to the saved file.
        """
        os.makedirs(directory, exist_ok=True)
        path = os.path.join(directory, filename)
        joblib.dump({"vectorizer": self.vectorizer, "classifier": self.classifier}, path)
        return path

    def load(self, filepath: str) -> None:
        """Load the vectorizer and classifier from disk.

        Args:
            filepath: Path to the saved joblib file.
        """
        data = joblib.load(filepath)
        self.vectorizer = data["vectorizer"]
        self.classifier = data["classifier"]


def load_dataset(csv_path: str) -> Tuple[pd.Series, pd.Series]:
    """Load the dataset from a CSV file.

    Args:
        csv_path: Path to the CSV file with columns 'text' and 'label'.

    Returns:
        Tuple of (texts, labels) as pandas Series.
    """
    df = pd.read_csv(csv_path)
    return df["text"], df["label"]


def split_dataset(
    texts: pd.Series, labels: pd.Series, test_size: float = 0.2, random_state: int = 42
) -> Tuple[pd.Series, pd.Series, pd.Series, pd.Series]:
    """Split the dataset into training and test sets with stratification.

    Args:
        texts: Series of input texts.
        labels: Series of binary labels.
        test_size: Proportion of the dataset to include in the test split.
        random_state: Random seed for reproducibility.

    Returns:
        Tuple of (X_train, X_test, y_train, y_test).
    """
    return train_test_split(
        texts, labels, test_size=test_size, random_state=random_state, stratify=labels
    )


if __name__ == "__main__":
    # Example usage: load dataset, split, train, evaluate, and save.
    dataset_path = "data/security_prompts.csv"
    model_dir = "models"

    # Load dataset
    texts, labels = load_dataset(dataset_path)
    print(f"Dataset loaded: {len(texts)} examples")

    # Split dataset
    X_train, X_test, y_train, y_test = split_dataset(texts, labels)
    print(f"Training set: {len(X_train)} examples")
    print(f"Test set: {len(X_test)} examples")

    # Initialize and train classifier
    classifier = PromptSecurityClassifier()
    classifier.train(X_train, y_train)

    # Evaluate on test set
    results = classifier.evaluate(X_test, y_test)
    print("\nEvaluation results:")
    print(f"Accuracy: {results['accuracy']:.4f}")
    print(f"Precision: {results['precision']:.4f}")
    print(f"Recall: {results['recall']:.4f}")
    print(f"F1-score: {results['f1']:.4f}")
    print(f"Confusion Matrix:\n{results['confusion_matrix']}")

    # Save the classifier
    saved_path = classifier.save(model_dir)
    print(f"\nModel saved to: {saved_path}")

    # Load the classifier and verify
    classifier_loaded = PromptSecurityClassifier()
    classifier_loaded.load(saved_path)
    results_loaded = classifier_loaded.evaluate(X_test, y_test)
    print("\nEvaluation results (loaded model):")
    print(f"Accuracy: {results_loaded['accuracy']:.4f}")
    print(f"Precision: {results_loaded['precision']:.4f}")
    print(f"Recall: {results_loaded['recall']:.4f}")
    print(f"F1-score: {results_loaded['f1']:.4f}")
    print(f"Confusion Matrix:\n{results_loaded['confusion_matrix']}")

    # Check that the loaded model gives the same results
    assert np.allclose(results["accuracy"], results_loaded["accuracy"])
    assert np.allclose(results["precision"], results_loaded["precision"])
    assert np.allclose(results["recall"], results_loaded["recall"])
    assert np.allclose(results["f1"], results_loaded["f1"])
    assert np.array_equal(results["confusion_matrix"], results_loaded["confusion_matrix"])
    print("\nLoaded model matches trained model.")