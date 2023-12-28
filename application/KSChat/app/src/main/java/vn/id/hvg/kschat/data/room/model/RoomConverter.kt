package vn.id.hvg.kschat.data.room.model

import androidx.room.TypeConverter
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import vn.id.hvg.kschat.contants.Gender
import vn.id.hvg.kschat.contants.MessageType

class RoomConverter {
    @TypeConverter
    fun genderFromString(value: String?): Gender {
        return Gender.valueOf(value!!)
    }

    @TypeConverter
    fun genderToString(type: Gender): String {
        return type.name
    }
    @TypeConverter
    fun messageTypeFromString(value: String?): MessageType {
        return MessageType.valueOf(value!!)
    }

    @TypeConverter
    fun messageTypeToString(type: MessageType): String {
        return type.name
    }

    @TypeConverter
    fun fromList(value: List<String>): String {
        val gson = Gson()
        val type = object : TypeToken<List<String>>() {}.type
        return gson.toJson(value, type)
    }

    @TypeConverter
    fun toList(value: String): List<String> {
        val gson = Gson()
        val type = object : TypeToken<List<String>>() {}.type
        return gson.fromJson(value, type)
    }
}