package vn.id.hvg.kschat.data.room.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import vn.id.hvg.kschat.data.room.model.User

@Dao
interface UserDao {
    @Query("SELECT * FROM user")
    fun getUsers(): List<User>

    @Insert
    fun insertUser(user: User)

    @Delete
    fun deleteUser(user: User)
}