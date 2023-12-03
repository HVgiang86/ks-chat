package vn.id.hvg.kschat.data.userstate

import android.util.Log
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import vn.id.hvg.kschat.data.network.retrofit.apiauth.JwtTokenDataStore
import javax.inject.Inject

class UserStateDataStore @Inject constructor(private val dataStore: DataStore<Preferences>) :
    UserStateManager {

    companion object {
        val USER_ID_KEY = stringPreferencesKey("user_id")
    }

    override suspend fun saveUserId(id: String) {
        dataStore.edit { preferences ->
            preferences[USER_ID_KEY] = id
        }
    }

    override suspend fun getUserId(): String? {
        val s = dataStore.data.map { preferences ->
            preferences[USER_ID_KEY]
        }.first()
        Log.d("LOG DATASTORE", "user id: $s")
        return s
    }

    override suspend fun removeUserId() {
        dataStore.edit { preferences ->
            preferences.remove(USER_ID_KEY)
        }
    }
}