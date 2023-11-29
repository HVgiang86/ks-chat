package vn.id.hvg.kschat.di

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.core.handlers.ReplaceFileCorruptionHandler
import androidx.datastore.preferences.core.PreferenceDataStoreFactory
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.preferencesDataStoreFile
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import okhttp3.Cache
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import vn.id.hvg.kschat.contants.BASE_URL
import vn.id.hvg.kschat.contants.HTTP_TIMEOUT
import vn.id.hvg.kschat.data.network.api.AuthenticatedApi
import vn.id.hvg.kschat.data.network.api.RefreshTokenApi
import vn.id.hvg.kschat.data.network.api.UnauthenticatedApi
import vn.id.hvg.kschat.data.network.retrofit.apiauth.AuthAuthenticator
import vn.id.hvg.kschat.data.network.retrofit.apiauth.JwtTokenDataStore
import vn.id.hvg.kschat.data.network.retrofit.apiauth.JwtTokenInterceptor
import vn.id.hvg.kschat.data.network.retrofit.apiauth.JwtTokenManager
import vn.id.hvg.kschat.data.network.retrofit.apiauth.RefreshTokenInterceptor
import java.util.concurrent.TimeUnit
import javax.inject.Named
import javax.inject.Singleton

const val AUTH_PREFERENCES = "vn.id.hvg.AUTH_PREFERENCES"

@InstallIn(SingletonComponent::class)
@Module
object NetworkModule {
    @Provides
    @Singleton
    fun provideDataStore(@ApplicationContext context: Context): DataStore<Preferences> {
        return PreferenceDataStoreFactory.create(corruptionHandler = ReplaceFileCorruptionHandler(
            produceNewData = { emptyPreferences() }),
            produceFile = { context.preferencesDataStoreFile(AUTH_PREFERENCES) })
    }

    @Provides
    @Singleton
    fun provideJwtTokenManager(dataStore: DataStore<Preferences>): JwtTokenManager {
        return JwtTokenDataStore(dataStore)
    }

    @Provides
    @Singleton
    fun provideHttpCache(@ApplicationContext context: Context): Cache {
        val cacheSize = 10 * 1024 * 1024
        return Cache(context.cacheDir, cacheSize.toLong())
    }

    @Provides
    @Singleton
    fun provideGsonBuilder(): Gson {
        return GsonBuilder().excludeFieldsWithModifiers().create()
    }


    @Provides
    @Singleton
    @Named("authenticatedClient")
    fun providerAccessOkHttpClient(
        cache: Cache,
        accessTokenInterceptor: JwtTokenInterceptor,
        authAuthenticator: AuthAuthenticator
    ): OkHttpClient {

        val client = OkHttpClient.Builder()
        client.cache(cache)
        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.HEADERS
            level = HttpLoggingInterceptor.Level.BODY
        }
        client.connectTimeout(HTTP_TIMEOUT.toLong(), TimeUnit.SECONDS)
        client.readTimeout(HTTP_TIMEOUT.toLong(), TimeUnit.SECONDS)
        client.writeTimeout(HTTP_TIMEOUT.toLong(), TimeUnit.SECONDS)
        client.authenticator(authAuthenticator)
        client.addInterceptor(accessTokenInterceptor)
        client.addInterceptor(loggingInterceptor)
        return client.build()
    }

    @Provides
    @Singleton
    @Named("tokenRefreshClient")
    fun providerTokenRefreshOkHttpClient(
        cache: Cache,
        refreshTokenInterceptor: RefreshTokenInterceptor
    ): OkHttpClient {

        val client = OkHttpClient.Builder()
        client.cache(cache)
        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.HEADERS
            level = HttpLoggingInterceptor.Level.BODY
        }
        client.connectTimeout(HTTP_TIMEOUT.toLong(), TimeUnit.SECONDS)
        client.readTimeout(HTTP_TIMEOUT.toLong(), TimeUnit.SECONDS)
        client.writeTimeout(HTTP_TIMEOUT.toLong(), TimeUnit.SECONDS)
        client.addInterceptor(refreshTokenInterceptor)
        client.addInterceptor(loggingInterceptor)
        return client.build()
    }


    @Provides
    @Singleton
    @Named("unauthenticatedClient")
    fun providerUnauthenticatedOkHttpClient(cache: Cache): OkHttpClient {

        val client = OkHttpClient.Builder()
        client.cache(cache)
        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.HEADERS
            level = HttpLoggingInterceptor.Level.BODY
        }
        client.connectTimeout(HTTP_TIMEOUT.toLong(), TimeUnit.SECONDS)
        client.readTimeout(HTTP_TIMEOUT.toLong(), TimeUnit.SECONDS)
        client.writeTimeout(HTTP_TIMEOUT.toLong(), TimeUnit.SECONDS)
        client.addInterceptor(loggingInterceptor)
        return client.build()
    }

    @Provides
    @Singleton
    @Named("authenticatedBuilder")
    fun provideAccessRetrofit(@Named("authenticatedClient") okHttpClient: OkHttpClient): Retrofit.Builder {
        return Retrofit.Builder().baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create()).client(okHttpClient)
    }

    @Provides
    @Singleton
    @Named("tokenRefreshBuilder")
    fun provideRefreshTokenRetrofit(@Named("tokenRefreshClient") okHttpClient: OkHttpClient): Retrofit.Builder {
        return Retrofit.Builder().baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create()).client(okHttpClient)
    }

    @Provides
    @Singleton
    @Named("unauthenticatedBuilder")
    fun provideUnauthenticatedRetrofit(@Named("unauthenticatedClient") okHttpClient: OkHttpClient): Retrofit.Builder {
        return Retrofit.Builder().baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create()).client(okHttpClient)
    }

    @Provides
    @Singleton
    fun provideAuthenticatedApi(@Named("authenticatedBuilder") retrofit: Retrofit.Builder): AuthenticatedApi {
        return retrofit.build().create(AuthenticatedApi::class.java)
    }

    @Provides
    @Singleton
    fun provideRefreshTokenApi(@Named("tokenRefreshBuilder") retrofit: Retrofit.Builder): RefreshTokenApi {
        return retrofit.build().create(RefreshTokenApi::class.java)
    }

    @Provides
    @Singleton
    fun provideUnauthenticatedApi(@Named("unauthenticatedBuilder") retrofit: Retrofit.Builder): UnauthenticatedApi {
        return retrofit.build().create(UnauthenticatedApi::class.java)
    }

}