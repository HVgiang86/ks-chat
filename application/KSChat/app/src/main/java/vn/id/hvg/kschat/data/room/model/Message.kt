package vn.id.hvg.kschat.data.room.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import vn.id.hvg.kschat.contants.MessageType
import java.util.Date

@Entity(tableName = "chat_message")
data class Message(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val roomId: String,
    val type: MessageType,
    val senderId: String,
    val receiverId: String,
    val content: String,
    val timestamp: Date
)
