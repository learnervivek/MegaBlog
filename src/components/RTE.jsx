import React, { useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Controller } from 'react-hook-form'

export default function RTE({ name, control, label, defaultValue = "" }) {
    const [editorError, setEditorError] = useState(false);

    return (
        <div className='w-full'>
            {label && <label className='inline-block mb-1 pl-1'>{label}</label>}
            <Controller
                name={name || "content"}
                control={control}
                rules={{ required: "Content is required" }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <div>
                        {!editorError ? (
                    <Editor
                    apiKey="3x00qqkw4efj4rok689zt8zmy89slm7q83c90aikg5av4ifz"
                        initialValue={defaultValue}
                                value={value}
                        init={{
                            height: 500,
                            menubar: true,
                                    plugins: [
                                        "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                                        "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                                        "insertdatetime", "media", "table", "help", "wordcount"
                                    ],
                                    toolbar: "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                    setup: function(editor) {
                                        editor.on('init', function() {
                                            setEditorError(false);
                                        });
                                        editor.on('loadContent', function() {
                                            setEditorError(false);
                                        });
                                    }
                                }}
                                onEditorChange={(content) => {
                                    onChange(content);
                                    setEditorError(false);
                                }}
                                onInit={() => {
                                    setEditorError(false);
                                }}
                                onLoadContent={() => {
                                    setEditorError(false);
                                }}
                                onError={(e) => {
                                    console.error('TinyMCE Error:', e);
                                    setEditorError(true);
                                }}
                            />
                        ) : (
                            <div>
                                <textarea
                                    value={value || defaultValue}
                                    onChange={(e) => onChange(e.target.value)}
                                    className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none"
                                    placeholder="Enter your blog content here..."
                                />
                                <p className="text-orange-500 text-sm mt-1">
                                    Using fallback editor. For better experience, refresh the page.
                                </p>
                            </div>
                        )}
                        {error && (
                            <p className="text-red-500 text-sm mt-1">
                                {error.message}
                            </p>
                        )}
                    </div>
                )}
            />
        </div>
    )
}

// export default RTE
