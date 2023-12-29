package vn.id.hvg.kschat.data.room.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import vn.id.hvg.kschat.data.room.model.User

@Dao
interface UserDao {
    @Query("SELECT * FROM user")
    fun getUsers(): List<User>?

    @Query("SELECT * FROM user LIMIT 1")
    fun getMyUser(): User?

    @Insert(onConflict = OnConflictStrategy.FAIL)
    fun insertUser(user: User)

    @Query("DELETE FROM user WHERE id = (:id)")
    fun deleteUser(id: String)

    @Query("DELETE FROM user")
    fun deleteAllUser()

    @Update
    fun updateUser(user: User)

}