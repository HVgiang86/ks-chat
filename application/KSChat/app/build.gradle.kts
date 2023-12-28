@Suppress("DSL_SCOPE_VIOLATION") // TODO: Remove once KTIJ-19369 is fixed
plugins {
    alias(libs.plugins.androidApplication)
    alias(libs.plugins.jetbrainsKotlinAndroid)
    id("kotlin-kapt")
    id("com.google.dagger.hilt.android")
    id("kotlin-parcelize")
    id("dagger.hilt.android.plugin")
    id("com.google.devtools.ksp")
}

android {
    namespace = "vn.id.hvg.kschat"
    compileSdk = 34

    defaultConfig {
        applicationId = "vn.id.hvg.kschat"
        minSdk = 21
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_18
        targetCompatibility = JavaVersion.VERSION_18
    }
    kotlinOptions {
        jvmTarget = "18"
    }
    buildFeatures {
        viewBinding = true
        dataBinding = true
    }

}

dependencies {

    //core dependencies
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.kotlinx)
    implementation(libs.kotlin.stdlib)
    implementation(libs.androidx.swiperefreshlayout)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)

    //okhttp3
    implementation(libs.okhttp)
    implementation(libs.logging.interceptor)

    //retrofit
    implementation(libs.rx2.android.networking)
    implementation(libs.rxjava)
    implementation(libs.rxandroid)
    implementation(libs.gson)
    implementation(libs.retrofit)
    implementation(libs.converter.gson)

    //datastore preferences
    implementation(libs.androidx.datastore.preferences)
    implementation(libs.androidx.datastore)
    implementation(libs.androidx.datastore.preferences)
    implementation(libs.androidx.datastore)

    //dagger hilt
    implementation(libs.androidx.activity.ktx)
    implementation(libs.dagger)
    implementation(libs.hilt.android)
    
    //use kapt instead of ksp.
    //kapt(libs.google.dagger.compiler)
    //kapt(libs.hilt.android.compiler)

    ksp(libs.google.dagger.compiler)
    ksp(libs.hilt.android.compiler)

    //coroutines
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.kotlinx.coroutines.rx2)

    //mvvm livedata viewmodel
    implementation(libs.androidx.lifecycle.livedata.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)

    //lottie animation by airbnb
    implementation(libs.lottie)

    //Room DB
    implementation(libs.androidx.room.runtime)
    annotationProcessor(libs.androidx.room.compiler)
    // To use Kotlin Symbol Processing (KSP)
    ksp(libs.androidx.room.compiler)
    // optional - Kotlin Extensions and Coroutines support for Room
    implementation(libs.room.ktx)
    // optional - RxJava2 support for Room
    implementation(libs.androidx.room.rxjava2)


}

// Allow references to generated code
/*
//use kapt instead of ksp
kapt {
    correctErrorTypes = true
}*/
