package vn.id.hvg.kschat.data.repositories

import vn.id.hvg.kschat.data.room.model.Profile

interface UserRepository {
    suspend fun getMyProfile(): Profile?
    suspend fun getProfileById(id: String)
    suspend fun getAllSharedProfile()
    suspend fun updateProfile()
}