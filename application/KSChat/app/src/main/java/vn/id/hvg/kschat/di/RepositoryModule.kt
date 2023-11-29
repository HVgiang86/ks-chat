package vn.id.hvg.kschat.di

import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import vn.id.hvg.kschat.data.network.api.AuthenticatedApi
import vn.id.hvg.kschat.data.network.api.RefreshTokenApi
import vn.id.hvg.kschat.data.network.api.UnauthenticatedApi
import vn.id.hvg.kschat.data.repositories.AuthRepository
import vn.id.hvg.kschat.data.repositories.AuthRepositoryImpl
import javax.inject.Singleton

@InstallIn(SingletonComponent::class)
@Module
class RepositoryModule {
    @Provides
    @Singleton
    fun provideAuthRepository(
        authenticatedApi: AuthenticatedApi,
        tokenResponse: RefreshTokenApi,
        unauthenticatedApi: UnauthenticatedApi
    ): AuthRepository {
        return AuthRepositoryImpl(
            authenticatedApi = authenticatedApi,
            tokenResponse = tokenResponse,
            unauthenticatedApi = unauthenticatedApi
        )
    }
}