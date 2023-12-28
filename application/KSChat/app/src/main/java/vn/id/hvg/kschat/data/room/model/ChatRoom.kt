package vn.id.hvg.kschat.data.room.model

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Created by daovu on 9/1/20.
 * @author Giang Hoang
 * a chat room is a conversation with a partner
 * room id is partner id
 */
@Entity(tableName = "chat_room")
data class ChatRoom(
    @PrimaryKey val roomId: String,
    val isCurrentChat: Boolean,
    val roomName: String
)
