package vn.id.hvg.kschat.di

import android.content.Context
import androidx.room.Room
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import vn.id.hvg.kschat.data.room.dao.MessageDao
import vn.id.hvg.kschat.data.room.dao.ProfileDao
import vn.id.hvg.kschat.data.room.dao.RoomDao
import vn.id.hvg.kschat.data.room.dao.UserDao
import vn.id.hvg.kschat.data.room.database.ChatDatabase
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
class RoomModule {
    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): ChatDatabase = Room.databaseBuilder(context,ChatDatabase::class.java,"chatDatabase").build()

    @Provides
    fun provideUserDao(chatDatabase: ChatDatabase): UserDao = chatDatabase.getUserDao()

    @Provides
    fun provideMessageDao(chatDatabase: ChatDatabase): MessageDao = chatDatabase.getChatMessageDao()

    @Provides
    fun provideProfileDao(chatDatabase: ChatDatabase): ProfileDao = chatDatabase.getProfileDao()

    @Provides
    fun provideRoomDao(chatDatabase: ChatDatabase): RoomDao = chatDatabase.getChatRoomDao()


}