import pandas as pd
import os
import joblib # type: ignore
from sklearn.feature_extraction.text import TfidfVectorizer # type: ignore
from sklearn.decomposition import TruncatedSVD # type: ignore
from sklearn.ensemble import RandomForestClassifier # type: ignore
from sklearn.model_selection import train_test_split # type: ignore
from sklearn.metrics import classification_report # type: ignore
from imblearn.over_sampling import SMOTE # type: ignore

MODEL_DIR = "model"
MODEL_PATH = os.path.join(MODEL_DIR, "toxic_model.pkl")
VEC_PATH = os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl")
SVD_PATH = os.path.join(MODEL_DIR, "svd_transformer.pkl")
# df = pd.read_csv('toxic_dataset_simple.csv')
# df = df.rename(columns={df.columns[0]: "text", df.columns[1]: "label"})
# X = df['text']
# y = df['label']

# X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=42)

# vectorizer = TfidfVectorizer(max_features=500)
# X_train_vec = vectorizer.fit_transform(X_train)

# svd = TruncatedSVD(n_components=50, random_state=42)
# X_train_reduced = svd.fit_transform(X_train_vec)

# smote = SMOTE(random_state=42)
# X_balanced, y_balanced = smote.fit_resample(X_train_reduced, y_train)

# model = RandomForestClassifier()
# model.fit(X_balanced, y_balanced)

# X_test_vec = vectorizer.transform(X_test)
# X_test_reduced = svd.transform(X_test_vec)
# y_pred = model.predict(X_test_reduced)
# joblib.dump(model, MODEL_PATH)
# joblib.dump(vectorizer, MODEL_PATH)
# joblib.dump(svd, MODEL_PATH)

def load_model():
    model = joblib.load(f"{MODEL_DIR}/logreg_toxic_model.pkl")
    vectorizer = joblib.load(f"{MODEL_DIR}/tfidf_vectorizer.pkl")
    svd = joblib.load(f"{MODEL_DIR}/svd_transformer.pkl")
    return model, vectorizer, svd
