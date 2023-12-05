package vn.id.hvg.kschat.utils

import android.os.Handler

object Utils {
    fun getTag(o: Any): String {
        return if (!o.javaClass.isAnonymousClass) {
            val name = o.javaClass.simpleName
            if (name.length <= 23) name else name.substring(0, 23)// first 23 chars
        } else {
            val name = o.javaClass.name
            if (name.length <= 23) name else name.substring(name.length - 23, name.length)// last 23 chars
        }
    }

    fun delayFunction(function: () -> Unit, time: Long) {
        @Suppress("DEPRECATION") val handler = Handler()
        handler.postDelayed(function, time)
    }
}