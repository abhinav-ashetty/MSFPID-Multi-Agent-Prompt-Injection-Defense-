# AIShield Defender Phase 2B.2 - ML Classifier Implementation Report

## Overview
This report details the implementation of the ML-based security classifier for AIShield Defender as specified in Phase 2B.2. The implementation uses TF-IDF + Logistic Regression to classify input prompts as BENIGN or MALICIOUS.

## Files Created
1. `backend/generate_dataset.py` - Script to generate the security prompts dataset
2. `backend/data/security_prompts.csv` - Dataset containing 200 examples (100 benign, 100 malicious)
3. `backend/app/agents/defender/ml_classifier.py` - ML classifier implementation (PromptSecurityClassifier class)
4. `backend/tests/test_ml_classifier.py` - Unit tests for the ML classifier
5. `backend/models/prompt_security_classifier.joblib` - Saved trained model using joblib

## Files Modified
- No existing files were modified. All work was done by creating new files to preserve existing functionality.

## Dataset Information
- **Dataset size**: 200 total examples
- **Number of benign samples**: 100 (label = 0)
- **Number of malicious samples**: 100 (label = 1)
- **Attack categories represented**:
  - Instruction override
  - System prompt extraction
  - Role manipulation
  - Security bypass
  - Sensitive information request
- **Dataset source**: Synthetic research examples generated for prototyping
- **Documentation**: All examples are explicitly documented as synthetic research examples and do not represent real-world prevalence

## Train/Test Split
- **Split ratio**: 80% training, 20% testing
- **Training set size**: 160 examples
- **Test set size**: 40 examples
- **Random state**: 42 (for reproducibility)
- **Stratification**: Used to maintain class proportions in both splits

## TF-IDF Configuration
- **Vectorizer**: `sklearn.feature_extraction.text.TfidfVectorizer`
- **Parameters**:
  - `max_features`: 10000
  - `ngram_range`: (1, 2) - unigrams and bigrams
  - `lowercase`: True
- **Justification**: 
  - max_features=10000 limits dimensionality while capturing sufficient semantic features
  - ngram_range=(1,2) captures both individual words and common phrases
  - lowercase=True ensures case-insensitive matching
  - These parameters provide a good balance between performance and interpretability for text classification

## Logistic Regression Configuration
- **Classifier**: `sklearn.linear_model.LogisticRegression`
- **Parameters**:
  - `random_state`: 42 (for reproducibility)
  - `max_iter`: 1000 (to ensure convergence)
- **Justification**:
  - Random state ensures reproducible results across runs
  - High max_iter value ensures the solver converges even with challenging datasets
  - Uses liblinear solver by default which works well for small to medium datasets

## Evaluation Results (Hold-out Test Set)
- **Accuracy**: 0.9500 (95.0%)
- **Precision**: 0.9091 (90.91%)
- **Recall**: 1.0000 (100.0%)
- **F1-score**: 0.9524 (95.24%)
- **Confusion Matrix**:
  ```
  [[18  2]
   [ 0 20]]
  ```
  - True Negatives (TN): 18 (benign correctly classified)
  - False Positives (FP): 2 (benign incorrectly classified as malicious)
  - False Negatives (FN): 0 (malicious incorrectly classified as benign)
  - True Positives (TP): 20 (malicious correctly classified)

## Model Persistence Method
- **Method**: joblib serialization
- **Location**: `backend/models/prompt_security_classifier.joblib`
- **Implementation**: 
  - Both TF-IDF vectorizer and Logistic Regression classifier are saved together in a single joblib file
  - The `save()` method serializes the model components
  - The `load()` method deserializes and restores both components
  - Verified that loaded model produces identical predictions to the original trained model

## Data Leakage Prevention
- **Train/Test Split Before Fitting**: The dataset is split into training and test sets BEFORE fitting the TF-IDF vectorizer
- **Correct Order of Operations**:
  1. Load raw dataset
  2. Split into train/test sets (stratified, random_state=42)
  3. Fit TF-IDF vectorizer ONLY on training text
  4. Transform both training and test text using the fitted vectorizer
  5. Train Logistic Regression on transformed training data
  6. Evaluate ONLY on transformed test data (never used during vectorizer fitting or model training)
- **Verification**: The implementation strictly follows the protocol to ensure test samples remain completely unseen during training and preprocessing

## Tests Passed
- **Rule-based detector tests**: 26 passed (existing tests continue to pass)
- **ML classifier tests**: 14 passed (all new tests for the ML implementation)
- **Total relevant tests passed**: 40
- **Note**: Existing non-Gemini Defender tests continue to pass (verified separately)

## Warnings
- No warnings were generated during implementation or testing
- All dependencies (scikit-learn, joblib) were already present in the requirements.txt
- The implementation strictly avoids unsolicited modifications to existing working components

## Complete ML Pipeline Explanation
The ML security classifier works as follows:

1. **Text Preprocessing**: Input text is converted to lowercase (if configured) and tokenized
2. **Feature Extraction**: TF-IDF vectorizer converts text to numerical features representing word importance
   - Considers both individual words (unigrams) and pairs of consecutive words (bigrams)
   - Weights terms by their frequency-inverse document frequency score
3. **Classification**: Logistic Regression model predicts the probability of each class (BENIGN/MALICIOUS)
   - Learns a decision boundary in the TF-IDF feature space
   - Outputs probabilities for both classes
4. **Prediction**: The class with the highest probability is returned as the prediction
5. **Persistence**: Both the vectorizer and classifier are saved together to ensure identical preprocessing during inference

The classifier operates independently of any LLM or rule-based components, providing a purely statistical approach to prompt security classification based on linguistic patterns learned from the training dataset.

## Compliance with Requirements
- � ✅ TF-IDF + Logistic Regression implementation
- � ✅ No Gemini API calls in classifier
- � ✅ Reproducible train/test split with random_state=42
- � ✅ Proper data leakage prevention
- � ✅ Model persistence with joblib
- � ✅ Comprehensive evaluation metrics (accuracy, precision, recall, F1, confusion matrix)
- � ✅ Unit tests covering all required aspects
- � ✅ Existing tests continue to pass
- � ✅ No integration with rule detector or decision engine (as specified for later phases)