package vn.id.hvg.kschat.data.room.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Room
import androidx.room.Update
import kotlinx.coroutines.flow.Flow
import vn.id.hvg.kschat.data.room.model.ChatRoom

@Dao
interface RoomDao {
    @Query("SELECT * FROM chat_room")
    fun getAllRooms(): List<ChatRoom>

    @Query("SELECT * FROM chat_room WHERE roomId = (:id)")
    fun getRoomById(id: String): ChatRoom

    @Insert
    fun insertRoom(room: ChatRoom)

    @Update
    fun updateRoom(room: ChatRoom)

    @Query ("DELETE FROM chat_room WHERE roomId = (:id)")
    fun deleteRoomById(id: String)
}