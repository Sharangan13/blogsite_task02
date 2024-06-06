import { Fragment, useEffect } from "react"
import { Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { MDBDataTable} from 'mdbreact';
import {toast } from 'react-toastify'
import Sidebar from "./Sidebar"
import { adminClearError } from "../../slices/BlogsSlice"
import { adminGetBlogs } from "../../actions/BlogsActions"
import Loader from "../layouts/Loder";
import { deleteBlog } from "../../actions/BlogActions";
import { clearBlogDeleted } from "../../slices/BlogSlice";

export default function BlogList() {

    const truncateText = (text, charLimit) => {
        if (text.length > charLimit) {
            return text.slice(0, charLimit) + "...";
        }
        return text;
    };
    const { blogs = [], loading = true, error }  = useSelector(state => state.blogsState)
    const { isBlogDeleted,error:blogerror }  = useSelector(state => state.blogState)

    const dispatch = useDispatch();

    const setBlogs = () => {
        const data = {
            columns : [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Title',
                    field: 'title',
                    sort: 'asc'
                },
                {
                    label: 'Author Name',
                    field: 'author',
                    sort: 'asc'
                },
                {
                    label: 'Author',
                    field: 'authorId',
                    sort: 'asc'
                },
                
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                }
            ],
            rows : []
        }

        blogs.forEach( blog => {
            data.rows.push({
                id: blog._id,
                title: truncateText(blog.title,15),
                author : truncateText(blog.author,10),
                authorId : blog.authorId,
                actions: (
                    <Fragment>
                        <Button onClick={e => deleteHandler(e, blog._id)} className="btn btn-danger py-1 px-2 ml-2">
                            <i className="fa fa-trash"></i>
                        </Button>
                    </Fragment>
                )
            })
        })

        return data;
    }

    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteBlog(id))
    }

    useEffect(() => {
        if(error || blogerror) {
            toast(error|| blogerror, {
                position:"bottom-center",
                type: 'error',
                onOpen: ()=> { dispatch(adminClearError()) }
            })
            return
        }
        if(isBlogDeleted) {
            toast('Blog Deleted Succesfully!',{
                type: 'success',
                position:"bottom-center",
                onOpen: () => dispatch(clearBlogDeleted())
            })
            return;
        }

        dispatch(adminGetBlogs())
    },[dispatch, error,isBlogDeleted])


    return (
        <div className="row">
        <div className="col-12 col-md-2">
                <Sidebar/>
        </div>
        <div className="col-12 col-md-10">
            <h1 className="my-4">Blog List</h1>
            <Fragment>
                {loading ? <Loader/> : 
                    <MDBDataTable
                        data={setBlogs()}
                        bordered
                        striped
                        hover
                        className="px-3"
                    />
                }
            </Fragment>
        </div>
    </div>
    )
}