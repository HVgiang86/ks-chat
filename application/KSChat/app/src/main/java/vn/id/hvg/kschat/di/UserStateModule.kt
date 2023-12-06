package vn.id.hvg.kschat.di

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.core.handlers.ReplaceFileCorruptionHandler
import androidx.datastore.preferences.core.PreferenceDataStoreFactory
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.preferencesDataStoreFile
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import vn.id.hvg.kschat.data.network.retrofit.apiauth.JwtTokenDataStore
import vn.id.hvg.kschat.data.network.retrofit.apiauth.JwtTokenManager
import vn.id.hvg.kschat.data.userstate.UserStateDataStore
import vn.id.hvg.kschat.data.userstate.UserStateManager
import javax.inject.Named
import javax.inject.Singleton


private const val USER_STATE_PREFERENCES = "vn.id.hvg.USER_STATE_PREFERENCES"
@InstallIn(SingletonComponent::class)
@Module
object UserStateModule {

    @Provides
    @Singleton
    @Named("userStateDatastore")
    fun provideDataStore(@ApplicationContext context: Context): DataStore<Preferences> {
        return PreferenceDataStoreFactory.create(corruptionHandler = ReplaceFileCorruptionHandler(
            produceNewData = { emptyPreferences() }),
            produceFile = { context.preferencesDataStoreFile(USER_STATE_PREFERENCES) })
    }

    @Provides
    @Singleton
    fun provideUserStateManager(@Named("userStateDatastore")dataStore: DataStore<Preferences>): UserStateManager {
        return UserStateDataStore(dataStore)
    }


}