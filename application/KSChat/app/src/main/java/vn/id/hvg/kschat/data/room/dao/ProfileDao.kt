package vn.id.hvg.kschat.data.room.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import vn.id.hvg.kschat.data.room.model.Profile

@Dao
interface ProfileDao {
    @Query("SELECT * FROM profile WHERE id != (:userId)")
    fun getAllSharedProfileByUid(userId: String): List<Profile>

    @Query("SELECT * FROM profile WHERE id = (:userId)")
    fun getProfile(userId: String): Profile?

    @Insert
    fun insertProfile(profile: Profile)

    @Update
    fun updateProfile(profile: Profile)

    @Query("DELETE FROM profile WHERE id = (:id)")
    fun deleteProfile(id: String)
}