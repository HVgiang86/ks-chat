package vn.id.hvg.kschat.data.repositories

import androidx.lifecycle.MutableLiveData
import vn.id.hvg.kschat.contants.LoginState
import vn.id.hvg.kschat.contants.RegisterState
import vn.id.hvg.kschat.data.network.model.auth.RefreshTokenResponse

interface AuthRepository {
    suspend fun login(email: String, password: String, loginState: MutableLiveData<LoginState>)

    suspend fun register(
        email: String,
        password: String,
        registerState: MutableLiveData<RegisterState>
    )

    fun refreshToken(): RefreshTokenResponse
}