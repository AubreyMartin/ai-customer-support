import os

import httpx
from clerk_backend_api import Clerk
from clerk_backend_api.security.types import AuthenticateRequestOptions
from dotenv import load_dotenv
from fastapi import HTTPException, Request

load_dotenv()


def get_current_user_id(request: Request) -> str:
    secret_key = os.getenv("CLERK_SECRET_KEY")

    if not secret_key:
        raise HTTPException(
            status_code=503,
            detail="Clerk authentication is not configured.",
        )

    authorized_parties = [
        origin.strip()
        for origin in os.getenv(
            "CLERK_AUTHORIZED_PARTIES",
            "http://localhost:5173",
        ).split(",")
        if origin.strip()
    ]

    try:
        clerk = Clerk(bearer_auth=secret_key)

        clerk_request = httpx.Request(
            method=request.method,
            url=str(request.url),
            headers=dict(request.headers),
        )

        auth_state = clerk.authenticate_request(
            clerk_request,
            AuthenticateRequestOptions(
                authorized_parties=authorized_parties,
            ),
        )

        if not auth_state.is_signed_in:
            raise HTTPException(
                status_code=401,
                detail="Authentication required.",
            )

        user_id = auth_state.payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token.",
            )

        return user_id

    except HTTPException:
        raise

    except Exception as error:
        print(f"Clerk authentication error: {error}")

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token.",
        )