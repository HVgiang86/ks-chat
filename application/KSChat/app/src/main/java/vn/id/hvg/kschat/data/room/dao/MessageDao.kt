package vn.id.hvg.kschat.data.room.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow
import vn.id.hvg.kschat.data.room.model.ChatMessage

@Dao
interface MessageDao {
    @Query("SELECT * FROM  chat_message ORDER BY timestamp ASC")
    fun getAllMessages(): List<ChatMessage>

    @Query("SELECT * FROM  chat_message WHERE roomId = (:roomId) ORDER BY timestamp ASC")
    fun getAllMessagesByRoomId(roomId: String): Flow<List<ChatMessage>>

    @Query("SELECT * FROM  chat_message WHERE roomId = (:roomId) ORDER BY id DESC LIMIT 1")
    fun getLastMessageByRoomId(roomId: String): ChatMessage

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insertMessage(chatMessage: ChatMessage)

    @Update
    fun updateMessage(chatMessage: ChatMessage)

    @Query("DELETE FROM chat_message WHERE id = (:id)")
    fun deleteMessage(id: Int)
}