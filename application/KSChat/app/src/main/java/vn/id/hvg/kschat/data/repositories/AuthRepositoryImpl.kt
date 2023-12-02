package vn.id.hvg.kschat.data.repositories

import android.util.Log
import androidx.lifecycle.MutableLiveData
import kotlinx.coroutines.runBlocking
import vn.id.hvg.kschat.contants.LoginState
import vn.id.hvg.kschat.data.network.api.AuthenticatedApi
import vn.id.hvg.kschat.data.network.api.RefreshTokenApi
import vn.id.hvg.kschat.data.network.api.UnauthenticatedApi
import vn.id.hvg.kschat.data.network.model.auth.RefreshTokenResponse
import vn.id.hvg.kschat.data.network.model.auth.RegisterResponse
import vn.id.hvg.kschat.data.network.retrofit.apiauth.JwtTokenManager
import vn.id.hvg.kschat.utils.Utils
import javax.inject.Inject


class AuthRepositoryImpl @Inject constructor(
    private val authenticatedApi: AuthenticatedApi,
    private val tokenResponse: RefreshTokenApi,
    private val unauthenticatedApi: UnauthenticatedApi,
    private val jwtTokenManager: JwtTokenManager
) : AuthRepository {
    val TAG = Utils.getTag(this)

    override suspend fun login(email: String, password: String, loginState: MutableLiveData<LoginState>) {

        Log.d("HAHA", "login called")

        try {
            val response = unauthenticatedApi.login(email, password)
            if (response.isSuccessful) {
                Log.d("HEHE", "${response.code()}")

                val token = response.body()?.token
                val refreshToken = response.body()?.refreshToken
                loginState.postValue(LoginState.SUCCESS)
                runBlocking {
                    jwtTokenManager.saveAccessJwt(token.toString())
                    jwtTokenManager.saveRefreshJwt(refreshToken.toString())
                }

            } else {
                Log.d("HEH", "${response.code()}")
                when (response.code()) {
                    400, 401 -> {
                        loginState.postValue(LoginState.INCORRECT_CREDENTIALS)
                    }

                    else -> {
                        loginState.postValue(LoginState.UNKNOWN_ERROR)
                    }
                }

            }
        } catch (e: Exception) {
            e.printStackTrace()
            loginState.postValue(LoginState.NETWORK_ERROR)
        }
    }

    override fun register(email: String, password: String): RegisterResponse {
        TODO("Not yet implemented")
    }

    override fun refreshToken(): RefreshTokenResponse {
        TODO("Not yet implemented")
    }
}