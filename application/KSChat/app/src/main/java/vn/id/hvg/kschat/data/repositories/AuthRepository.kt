package vn.id.hvg.kschat.data.repositories

import androidx.lifecycle.MutableLiveData
import vn.id.hvg.kschat.contants.LoginState
import vn.id.hvg.kschat.data.network.model.auth.LoginResponse
import vn.id.hvg.kschat.data.network.model.auth.RefreshTokenResponse
import vn.id.hvg.kschat.data.network.model.auth.RegisterResponse

interface AuthRepository {
    suspend fun login(email: String, password: String, loginState: MutableLiveData<LoginState>)

    fun register(email: String, password: String): RegisterResponse
    fun refreshToken(): RefreshTokenResponse
}