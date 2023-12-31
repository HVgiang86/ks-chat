package vn.id.hvg.kschat.di

import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import vn.id.hvg.kschat.data.network.api.AuthenticatedApi
import vn.id.hvg.kschat.data.network.api.RefreshTokenApi
import vn.id.hvg.kschat.data.network.api.UnauthenticatedApi
import vn.id.hvg.kschat.data.network.retrofit.apiauth.JwtTokenManager
import vn.id.hvg.kschat.data.repositories.AuthRepository
import vn.id.hvg.kschat.data.repositories.AuthRepositoryImpl
import vn.id.hvg.kschat.data.userstate.UserStateManager
import javax.inject.Singleton

@InstallIn(SingletonComponent::class)
@Module
class RepositoryModule {
    @Provides
    @Singleton
    fun provideAuthRepository(
        authenticatedApi: AuthenticatedApi,
        tokenResponse: RefreshTokenApi,
        unauthenticatedApi: UnauthenticatedApi,
        jwtTokenManager: JwtTokenManager,
        userStateManager: UserStateManager
    ): AuthRepository {
        return AuthRepositoryImpl(
            authenticatedApi = authenticatedApi,
            tokenResponse = tokenResponse,
            unauthenticatedApi = unauthenticatedApi,
            jwtTokenManager = jwtTokenManager,
            userStateManager = userStateManager,
        )
    }
}