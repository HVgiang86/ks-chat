package vn.id.hvg.kschat.data.network.retrofit.apiauth

interface JwtTokenManager {
    suspend fun saveAccessJwt(token: String)
    suspend fun saveRefreshJwt(token: String)
    suspend fun getAccessJwt(): String?
    suspend fun getRefreshJwt(): String?
    suspend fun clearAllTokens()
}