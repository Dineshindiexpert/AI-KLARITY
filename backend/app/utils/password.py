from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)
def normalize_password(password: str): return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except:
        # fallback old system
        return pwd_context.verify(normalize_password(plain_password), hashed_password)