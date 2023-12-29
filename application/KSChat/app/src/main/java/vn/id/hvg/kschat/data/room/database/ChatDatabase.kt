package vn.id.hvg.kschat.data.room.database

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import vn.id.hvg.kschat.data.room.dao.MessageDao
import vn.id.hvg.kschat.data.room.dao.ProfileDao
import vn.id.hvg.kschat.data.room.dao.RoomDao
import vn.id.hvg.kschat.data.room.dao.UserDao
import vn.id.hvg.kschat.data.room.model.ChatMessage
import vn.id.hvg.kschat.data.room.model.ChatRoom
import vn.id.hvg.kschat.data.room.model.Profile
import vn.id.hvg.kschat.data.room.model.RoomConverter
import vn.id.hvg.kschat.data.room.model.User

@Database(
    entities = [ChatMessage::class, ChatRoom::class, Profile::class, User::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(RoomConverter::class)
abstract class ChatDatabase : RoomDatabase() {
    abstract fun getChatMessageDao(): MessageDao
    abstract fun getChatRoomDao(): RoomDao
    abstract fun getProfileDao(): ProfileDao
    abstract fun getUserDao(): UserDao
}