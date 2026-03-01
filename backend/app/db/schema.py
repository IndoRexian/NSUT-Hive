import uuid
from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Department(Base):
    """
    ORM Model for Department
    """

    __tablename__ = "departments"
    department_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    link: Mapped[str]


class Professor(Base):
    """
    ORM Model for Professor
    """

    __tablename__ = "professors"
    professor_id: Mapped[int] = mapped_column(primary_key=True)
    public_id: Mapped[str]
    name: Mapped[str]
    department: Mapped[int] = mapped_column(ForeignKey("departments.id"))
    designation: Mapped[str]
    qualifications: Mapped[str]
    email: Mapped[str]
    img_link: Mapped[str]
    nsut_link: Mapped[str]
    cat_1: Mapped[float] = mapped_column(default=0)
    cat_2: Mapped[float] = mapped_column(default=0)
    cat_3: Mapped[float] = mapped_column(default=0)
    cat_4: Mapped[float] = mapped_column(default=0)
    global_rating: Mapped[float] = mapped_column(default=0)


class OTPTOKEN(Base):
    """
    ORM Model for OTPTOKEN
    """

    __tablename__ = "otptokens"
    token_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email_hash: Mapped[str]
    otp_hash: Mapped[str]
    created_at: Mapped[datetime]
    expires_at: Mapped[datetime]
    used: Mapped[bool]


class User(Base):
    __tablename__ = "users"
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    username: Mapped[str]
    email_hash: Mapped[str]
    email_encrypted: Mapped[str]
    created_at: Mapped[datetime]
    promotional_optin: Mapped[bool]
    avatar_style: Mapped[str]


class Review(Base):
    __tablename__ = "reviews"
    review_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    professor_id: Mapped[int]
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.user_id"))
    created_at: Mapped[datetime]
    likes: Mapped[int] = mapped_column(default=0)
    dislikes: Mapped[int] = mapped_column(default=0)
    is_deleted: Mapped[bool] = mapped_column(default=False)
    cat_1: Mapped[float] = mapped_column(default=0)
    cat_2: Mapped[float] = mapped_column(default=0)
    cat_3: Mapped[float] = mapped_column(default=0)
    cat_4: Mapped[float] = mapped_column(default=0)
    review_text: Mapped[str] = mapped_column(nullable=True)


class Reaction(Base):
    __tablename__ = "reactions"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.user_id"), primary_key=True
    )
    review_id: Mapped[int] = mapped_column(
        ForeignKey("reviews.review_id"), primary_key=True
    )
    reacted_at: Mapped[datetime]
    state: Mapped[int]
