package vn.id.hvg.kschat.data.userstate

interface UserStateManager {
    suspend fun saveUserId(id: String)
    suspend fun getUserId(): String?

    suspend fun removeUserId()

}