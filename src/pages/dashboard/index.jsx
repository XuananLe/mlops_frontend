import React, { useState, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateFiles } from '../../utils/file'
import { UploadTypes } from '../../assets/data/constants'
import * as projectAPI from '../../api/project'
import logo from '../../assets/images/logo.png'
import { message } from 'antd'
const initialState = {
  show: false,
  showUploader: false,
  selectedBuild: null,
  uploadFiles: [],
}
const Dashboard = () => {
  const navigate = useNavigate()

  //state
  const [dashboardState, updateState] = useReducer((pre, next) => {
    return { ...pre, ...next }
  }, initialState)

  // handler
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files)
    const validFiles = validateFiles(files)
    updateState({ uploadFiles: validFiles })
  }
  const handleRemoveFile = (index) => {
    const newState = [...dashboardState.uploadFiles]
    newState.splice(index, 1)
    updateState({ uploadFiles: newState })
  }

  const uploadImages = async (e) => {
    e.preventDefault()
    if (dashboardState.uploadFiles !== undefined && dashboardState.uploadFiles.length > 0) {
      console.log(`Uploading ${dashboardState.uploadFiles.length} file(s) to server`)
      const formData = new FormData()
      formData.append('type', UploadTypes.FOLDER)
      for (let i = 0; i < dashboardState.uploadFiles.length; i++) {
        // Convert file name with relative path to base64 string
        const fileNameBase64 = window.btoa(dashboardState.uploadFiles[i].webkitRelativePath)
        formData.append('files', dashboardState.uploadFiles[i], fileNameBase64)
      }

      // TODO: Remove this line
      const projectID = '641ac7fd897b5152aaa371e9'
      const queryString = new URLSearchParams({ id: projectID }).toString()
      try {
        const { data } = await projectAPI.uploadFiles(projectID, formData)
        message.success('Successfully uploaded', 3)
        navigate(`/app/new-project?${queryString}`, { replace: true })
      } catch (error) {
        console.error(error)
      }
    }

    // TODO: validate folder structure
    // Nêú folder chỉ có toàn ảnh không có folder con thì hiển thị lỗi
  }

  return (
    <>
      {/* classify model */}

      {/* uploaded */}
      <div
        onClick={() => updateState({ show: true })}
        // for="file"
        className="flex flex-col w-[95%] cursor-pointer mt-10 shadow justify-between mx-auto items-center p-[10px] gap-[5px] bg-[rgba(0,110,255,0.041)] h-[300px] rounded-[10px] "
      >
        <div className="header flex flex-1 w-full border-[2px] justify-center items-center flex-col border-dashed border-[#4169e1] rounded-[10px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            fill="none"
            viewBox="0 0 100 100"
          >
            <mask
              id="mask0_908_734"
              style={{ maskType: 'alpha' }}
              width="100"
              height="100"
              x="0"
              y="0"
              maskUnits="userSpaceOnUse"
            >
              <path fill="#D9D9D9" d="M0 0H100V100H0z"></path>
            </mask>
            <g mask="url(#mask0_908_734)">
              <path
                fill="#65A4FE"
                d="M45.833 83.333h-18.75c-6.319 0-11.718-2.187-16.195-6.562-4.481-4.375-6.721-9.722-6.721-16.042 0-5.416 1.632-10.243 4.896-14.479 3.263-4.236 7.534-6.944 12.812-8.125 1.736-6.389 5.208-11.562 10.417-15.52 5.208-3.96 11.11-5.938 17.708-5.938 8.125 0 15.017 2.829 20.675 8.487 5.661 5.661 8.492 12.554 8.492 20.68 4.791.555 8.768 2.62 11.929 6.195 3.158 3.578 4.737 7.763 4.737 12.554 0 5.209-1.822 9.636-5.466 13.284-3.648 3.644-8.075 5.466-13.284 5.466H54.167V53.542L60.833 60l5.834-5.833L50 37.5 33.333 54.167 39.167 60l6.666-6.458v29.791z"
              ></path>
            </g>
          </svg>
          <p className="text-center text-black">Browse File to upload!</p>
        </div>
        <div
          // for="file"
          className="footer  bg-[rgba(0,110,255,0.075)] w-full h-[40px] p-2 flex rounded-[10px] cursor-pointer justify-between border-none text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="h-[130%] fill-[#4169e1] bg-[rgba(70,66,66,0.103)] rounded-full px-[2px] cursor-pointer shadow-[0_2px_30px_rgba(0,0,0,0.205)]"
          >
            <g>
              <path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path>
              <path d="M18.153 6h-.009v5.342H23.5v-.002z"></path>
            </g>
          </svg>

          <p>Not selected file</p>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <g stroke="#000" strokeWidth="2">
              <path d="M5.166 10.153A2 2 0 017.16 8h9.68a2 2 0 011.994 2.153l-.692 9A2 2 0 0116.148 21H7.852a2 2 0 01-1.994-1.847l-.692-9z"></path>
              <path strokeLinecap="round" d="M19.5 5h-15"></path>
              <path d="M10 3a1 1 0 011-1h2a1 1 0 011 1v2h-4V3z"></path>
            </g>
          </svg>
        </div>
        <input
          id="file"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          onClick={(event) => {
            event.target.value = null
          }}
        />
      </div>
      {/* bottom up modal of classify */}
      <div
        className={`${
          dashboardState.show
            ? 'top-0 bottom-full z-[99999] opacity-100'
            : 'top-full bottom-0 opacity-0'
        } fixed flex flex-col items-center h-full w-full px-[30px] justify-center bg-white  transition-all duration-500 ease`}
      >
        <button
          onClick={() => updateState({ show: false })}
          className="absolute top-5 right-5 p-[12px] rounded-full bg-white hover:bg-gray-300 hover:text-white font-[600] w-[48px] h-[48px]"
        >
          <svg
            class="hover:scale-125 hover:fill-red-500"
            focusable="false"
            viewBox="0 0 24 24"
            color="#69717A"
            aria-hidden="true"
            data-testid="close-upload-media-dialog-btn"
          >
            <path d="M18.3 5.71a.9959.9959 0 00-1.41 0L12 10.59 7.11 5.7a.9959.9959 0 00-1.41 0c-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"></path>
          </svg>
        </button>
        <h3 className="text-center w-full text-[24px] font-[500] leading-[1.16] mb-8 ">
          Select how you want upload images
        </h3>
        <div className="container flex justify-around items-center mx-auto gap-4">
          <div
            onClick={() => updateState({ showUploader: true })}
            className="w-full h-full bg-white p-10 rounded-md hover:scale-[1.02] transition-all ease-linear duration-100   cursor-pointer shadow-[0px_8px_24px_rgba(0,53,133,0.1)]"
          >
            <div className="flex flex-col">
              <p className="text-center text-[16px] ">Unclassified images upload</p>
              <p className="text-center text-[12px] font-[300]">
                uploaded images will be raw status, you can classify them using the platform
                labeling tool
              </p>
              <img
                src="https://dr23pab8nlq87.cloudfront.net/images/classification_upload_unclassified-3KDZ.png"
                alt=""
                className="mt-5"
              />
            </div>
          </div>
          <div
            onClick={() => updateState({ showUploader: true })}
            className="w-full h-full bg-white p-10 rounded-md hover:scale-[1.02] transition-all ease-linear duration-100   cursor-pointer shadow-[0px_8px_24px_rgba(0,53,133,0.1)]"
          >
            <div className="flex flex-col">
              <p className="text-center text-[16px] ">Classified Images </p>
              <p className="text-center text-[12px] font-[300]">
                uploaded images will be classified based on your folder structure
              </p>
              <img
                src="https://dr23pab8nlq87.cloudfront.net/images/classification_upload_classified-vOZv.png"
                alt=""
                className="mt-5"
              />
            </div>
          </div>
        </div>
      </div>
      {/* bottom up modal of classify image uploader */}
      <div
        className={`${
          dashboardState.showUploader
            ? 'top-0 z-[99999] opacity-100'
            : 'top-full bottom-0 opacity-0'
        } fixed flex flex-col items-center h-full w-full px-[30px] justify-center bg-white  transition-all duration-500 ease overscroll-auto overflow-auto min-h-screen`}
      >
        <button
          onClick={() => updateState({ showUploader: false })}
          className="absolute top-5 right-5 p-[12px] rounded-full bg-transparent hover:bg-gray-300 hover:text-white font-[600] w-[48px] h-[48px]"
        >
          <svg
            class="hover:scale-125 hover:fill-red-500"
            focusable="false"
            viewBox="0 0 24 24"
            color="#69717A"
            aria-hidden="true"
            data-testid="close-upload-media-dialog-btn"
          >
            <path d="M18.3 5.71a.9959.9959 0 00-1.41 0L12 10.59 7.11 5.7a.9959.9959 0 00-1.41 0c-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"></path>
          </svg>
        </button>
        <div className="h-[3000px] overflow-auto py-[100px] w-[calc(100vw-20px)]">
          <h3 className="text-center w-full text-[24px] font-[500] leading-[1.16] mb-8 ">
            Classified images upload
          </h3>
          <label
            htmlFor="classification"
            className="container flex justify-around items-center mx-auto border-[2px] border-dashed border-gray-500 p-5 rounded-[15px]"
          >
            <div className="w-full h-full bg-white p-10 rounded-md cursor-pointer">
              <div className="flex flex-col">
                <img
                  src="https://dr23pab8nlq87.cloudfront.net/images/unclassified_instruction_1-t77g.png"
                  alt=""
                  className="mt-5 w-[200px] h-full mx-auto"
                />

                <p className="text-center text-[12px] font-[300]">
                  We accept JPEG, PNG image format
                </p>
              </div>
            </div>
            <div className="w-full h-full bg-white p-10 rounded-md cursor-pointer">
              <div className="flex flex-col">
                <img
                  src="https://dr23pab8nlq87.cloudfront.net/images/unclassified_instruction_2-x08W.png"
                  alt=""
                  className="mt-5 w-[200px] h-full mx-auto"
                />

                <p className="text-center text-[12px] font-[300]">
                  Folder information will be automatically tagged as metadata to each media{' '}
                </p>
              </div>
            </div>
            <input
              type="file"
              name="files"
              webkitdirectory="true"
              id="classification"
              className="hidden"
              onChange={handleFileChange}
              onClick={(event) => {
                event.target.value = null
              }}
            />
          </label>
          <br />
          <div className="text-center mx-auto">
            {dashboardState.uploadFiles.length} Image(s) Ready for Upload
          </div>
          <br />
          <div className="flex justify-between items-center">
            <span className="mr-auto text-start font-[100] mt-[20px]">Upload Preview</span>
            <button
              className="bg-blue-700 rounded-[10px] text-[14px] text-white font-[400] py-[8px] px-[15px]"
              onClick={uploadImages}
            >
              Upload {dashboardState.uploadFiles.length} Image(s)
            </button>
          </div>
          <div className="h-[2px] bg-gray-100 w-full my-5"></div>
          <div className="grid grid-cols-6 gap-3 ">
            {dashboardState.uploadFiles.map((file, index) => (
              <div className="rounded-md overflow-hidden relative group hover:opacity-100">
                <button
                  className="absolute cursor-pointer right-2 top-2 bg-white flex justify-center items-center rounded-full h-[20px] w-[20px] opacity-0 group-hover:opacity-100"
                  onClick={() => {
                    handleRemoveFile(index)
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="h-[150px] w-full m-0 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
