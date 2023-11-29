package vn.id.hvg.kschat.data.repositories

import vn.id.hvg.kschat.data.network.api.AuthenticatedApi
import vn.id.hvg.kschat.data.network.api.RefreshTokenApi
import vn.id.hvg.kschat.data.network.api.UnauthenticatedApi
import vn.id.hvg.kschat.data.network.model.auth.LoginResponse
import vn.id.hvg.kschat.data.network.model.auth.RefreshTokenResponse
import vn.id.hvg.kschat.data.network.model.auth.RegisterResponse
import javax.inject.Inject

class AuthRepositoryImpl @Inject constructor(
    private val authenticatedApi: AuthenticatedApi,
    private val tokenResponse: RefreshTokenApi,
    private val unauthenticatedApi: UnauthenticatedApi
) : AuthRepository {
    override suspend fun login(email: String, password: String): LoginResponse {
        return authenticatedApi.login(email, password).execute().body()!!
    }

    override fun register(email: String, password: String): RegisterResponse {
        TODO("Not yet implemented")
    }

    override fun refreshToken(): RefreshTokenResponse {
        TODO("Not yet implemented")
    }
}