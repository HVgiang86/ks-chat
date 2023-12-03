package vn.id.hvg.kschat.views.uicomponents.popup

import android.app.Dialog
import android.os.Bundle
import android.view.Window
import android.widget.TextView
import androidx.appcompat.widget.AppCompatButton
import androidx.fragment.app.DialogFragment
import vn.id.hvg.kschat.R

class ErrorPopupFragment : DialogFragment() {
    companion object {
        internal const val NAME_KEY = "NAME_KEY"
        internal const val CONTENT_KEY = "CONTENT_KEY"

        fun newInstance(
            name: String?, content: String?
        ): ErrorPopupFragment {
            return ErrorPopupFragment().apply {
                arguments = Bundle().apply {
                    putString(NAME_KEY, name)
                    putString(CONTENT_KEY, content)
                }
            }
        }
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        val name = arguments?.getString(NAME_KEY).orEmpty()
        val content = arguments?.getString(CONTENT_KEY).orEmpty()

        val dialog = context?.let { Dialog(it, R.style.AppThemeNew_DialogTheme) }
        dialog?.requestWindowFeature(Window.FEATURE_NO_TITLE)
        dialog?.setContentView(R.layout.layout_dialog_error)
        dialog?.show()

        val nameTV = dialog?.findViewById<TextView>(R.id.tv_message)
        val contentTV = dialog?.findViewById<TextView>(R.id.tv_content)
        val button = dialog?.findViewById<AppCompatButton>(R.id.btn_accept)
        button?.setOnClickListener {
            dismiss()
        }

        nameTV?.text = name
        contentTV?.text = content

        return dialog!!
    }


}