# 認証用のユーティリティ
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from . import models, schemas

# パスワードハッシュ化の設定
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT設定
SECRET_KEY = "your-secret-key-change-this-in-production"  # 本番環境では環境変数に
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password, hashed_password):
    """パスワードの検証"""
    return pwd_context.verify(plain_password[:72], hashed_password)

def get_password_hash(password):
    """パスワードのハッシュ化"""
    return pwd_context.hash(password[:72])

def get_user_by_email(db: Session, email: str):
    """メールアドレスでユーザーを取得"""
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    """ユーザー名でユーザーを取得"""
    return db.query(models.User).filter(models.User.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    """ユーザー認証（usernameまたはemailで検索）"""
    print(f"[DEBUG] ログイン試行: username/email={username}")
    # usernameまたはemailで検索
    user = db.query(models.User).filter(
        (models.User.username == username) |
        (models.User.email == username)
    ).first()

    print(f"[DEBUG] ユーザー検索結果: {user}")
    print(f"[DEBUG] user.username={user.username if user else 'None'}")
    print(f"[DEBUG] user.email={user.email if user else 'None'}")

    if not user:
        print("[DEBUG] ユーザーが見つかりません")
        return False
    password_check = verify_password(password, user.hashed_password)
    print(f"[DEBUG] パスワード検証結果: {password_check}")
    if not password_check:
        return False
    print("[DEBUG] 認証成功")
    return user

def create_access_token(data: dict, expires_delta: timedelta = None):
    """アクセストークンの作成"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_user(db: Session, user: schemas.UserCreate):
    """新規ユーザーの作成"""
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ユーザー一覧を取得して表示
def get_current_user(token: str, db: Session):
    """トークンから現在のユーザーを取得"""
    from jose import JWTError, jwt

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="認証情報が無効です")
    except JWTError:
        raise HTTPException(status_code=401, detail="認証情報が無効です")

    user = get_user_by_username(db, username=username)
    if user is None:
        raise HTTPException(status_code=401, detail="ユーザーが見つかりません")

    return user