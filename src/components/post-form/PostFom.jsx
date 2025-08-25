import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from '../index'
import appwriteService from "../../appwrite/config"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            status: post?.status || 'active',
        },
    })

    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)
    const submit = async (data) => {
        // Warn user if content exceeds 255 characters (temporary limit)
        if (data.content && data.content.length > 107374182) {
            const proceed = window.confirm(
                `Warning: Your content is ${data.content.length} characters long. Due to current database limitations, it will be truncated to 255 characters. Do you want to continue?`
            );
            if (!proceed) return;
        }
        
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null

            if (file) {
                appwriteService.deleteFile(post.featureimage)
            }
            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featureimage: file ? file.$id : post.featureimage,
            })
            if (dbPost) {
                navigate(`/post/${data.slug || dbPost.$id}`)
            }
        } else {
            try {
                const file = await appwriteService.uploadFile(data.image[0]);
                console.log("Uploaded file:", file)
                if (file) {
                    const fileId = file.$id
                    data.featureimage = fileId
                    console.log("Creating post with user ID:", userData.$id);
                    const dbPost = await appwriteService.createPost({
                        ...data,
                        userid: userData.$id,
                    })
                    if (dbPost) {
                        navigate(`/post/${data.slug || dbPost.$id}`)
                    }
                }
            } catch (error) {
                console.error("Error creating post:", error);
                alert(`Failed to create post: ${error.message}`);
            }
        }



    }
    const slugTransform= useCallback((value)=>{
        if(value && typeof value=='string'){
            return value
            .trim()
            .toLowerCase()
            .replace(/\s/g,'-')
            
        }
    },[])
    React.useEffect(()=>{
const subscription=watch((value,{name})=>{
    if(name==='title'){
        setValue('slug',slugTransform(value.title,{shouldValidate:true}))
    }
})
return ()=>subscription.unsubscribe()

    },[watch,slugTransform,setValue])
    return (
        <form onSubmit={handleSubmit(submit)}
        className="flex flex-wrap"
        >
            <div className="w-2/3 px-2">
                <Input
                label="Title"
                placeholder="Title"
                className="mb-4"
                {...register("title", {required: true})}
                />
                <Input
                label="Slug :"
                placeholder="Slug"
                className="mb-4"
                {...register("slug", {required: true})}
                onInput={(e) => {
                    setValue("slug", slugTransform(e.currentTarget.value), {shouldValidate: true})
                }}
                />
                <RTE
                label="content: "//changed
                name="content"
                control={control}
                defaultValue={getValues("content")}
                />
            </div>
            <div className="w-1/3 px-2">
                <Input
                label="Featured Image"
                type="file"
                className="mb-4"
                accept="image/png, image/jpg, image/jpeg"
                {...register("image", {required: !post})}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img 
                          src={appwriteService.getFileView(post.featureimage)} 
                          alt={post.title}
                          className="rounded-lg w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="rounded-lg w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500" style={{display: 'none'}}>
                          Image not available
                        </div>
                    </div>
                )}
                <Select
                options={["active", "inactive"]}
                label="Status"
                className="mb-4"
                {...register("status", {required: true})}
                />
                <Button
                type="submit"
                bgColor={post ? "bg-green-500": undefined}
                className="w-full"
                >{post ? "Update": "Submit"}</Button>
            </div>
        </form>
    )
}