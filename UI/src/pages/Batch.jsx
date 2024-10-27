import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ButtonSpinner from "../components/common/ButtonSpinner";
import axiosPrivateInstance from "../utils/axiosConfig";
import Select from "react-select";
import AddBanner from "../components/common/AddBanner";
import { useNavigate } from "react-router-dom";
const roleId = localStorage.getItem("roleId");
const userId = localStorage.getItem("userId");
const defaultBranchId = localStorage.getItem("branchId");
const fetchFrom = roleId !== "2" ? "branch" : "institute";

const tableHeading = [
  "name",
  "branch",
  "course",
  "faculty",
  "startDate",
  "endDate",
  "startTime",
  "endTime",
];

const Batch = () => {
  const [tableData, setTableData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [modalData, setModalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBranch, setSearchBranch] = useState("");
  const [searchFaculty, setSearchFaculty] = useState("");
  const [branchId, setBranchId] = useState("");
  const [branchData, setBranchData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [isCourseSelectDisabled, setIsCourseSelectDisabled] = useState(true);
  const [isFacultySelectDisabled, setIsFacultySelectDisabled] = useState(true);
  const [errors, setErrors] = useState({});
  const [studentsList, setStudentsList] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [batchId, setBatchId] = useState(0);
  const [facultyOptions, setFacultyOptions] = useState([]);

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivateInstance.get(
        `/batch/${fetchFrom}?name=${searchQuery}&branch=${searchBranch}&facultyName=${searchFaculty}`
      );
      // console.log(response.data.data);
      setTableData(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchData = async () => {
    try {
      const response = await axiosPrivateInstance.get(`/branch/institute`);
      const branches = response.data.data;
      const activeBranch =
        roleId !== "2"
          ? branches.filter((branch) => branch.id === Number(defaultBranchId))
          : branches.filter((branch) => branch.isActive === true);
      setBranchData(activeBranch);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  const fetchFaculty = async () => {
    try {
      const response = await axiosPrivateInstance.get(`/faculty/institute`);
      const faculty = response.data.data;
      const activeBranch =
        roleId !== "2"
          ? faculty.filter((branch) => branch.id === Number(defaultBranchId))
          : faculty.filter((branch) => branch.isActive === true);
      console.log(activeBranch);
      setFacultyData(activeBranch);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const fetchCourseData = async (branchId) => {
    setBranchId(branchId);
    try {
      const response = await axiosPrivateInstance.get(
        `/course/branch/${branchId}`
      );
      const courses = response.data.data;
      const activeCourses = courses.filter((course) => course.isActive);
      // console.log('activeCourses: ', activeCourses);
      const coursesOptions = activeCourses.map((course) => ({
        value: course.id,
        label: course.name,
        modules: course.Modules,
      }));
      // console.log('coursesOptions: ', coursesOptions);
      setCourseData(coursesOptions);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const fetchFacultyData = async (moduleIds) => {
    // console.log('moduleIds: ', moduleIds);
    try {
      const response = await axiosPrivateInstance.post(
        `/faculty/branch/${branchId}/modules`,
        { moduleIds }
      );
      const faculties = response.data.data;
      // const activeFaculty = faculties.filter(faculty => faculty.isActive);
      // console.log('activeFaculty: ', activeFaculty);
      console.log(faculties);
      const facultyOptions = faculties.map((faculty) => ({
        value: faculty.id,
        label: faculty.fullName,
      }));
      console.log('facultyOptions: ', facultyOptions);
      setFacultyOptions(facultyOptions);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchTableData();
    fetchBranchData();
    fetchFaculty();
  }, []);
  useEffect(() => {
    fetchTableData();
  }, [searchBranch, searchFaculty, searchQuery]);

  const fetchPreFillData = async (index) => {
    const selectedTableData = tableData.find((item) => item.id === index.id);
    setModalData(selectedTableData);
    setModalData({
      ...selectedTableData,
      facultyId: selectedTableData.Faculties.map((faculty) => faculty.id),
    });
    setIsCourseSelectDisabled(false);
    await fetchCourseData(selectedTableData.branchId);
    setIsFacultySelectDisabled(false);
  };

  const handleEditButton = (e) => {
    setAdd(false);
    setEdit(true);
    const index = tableData[parseInt(e.target.name)];
    // console.log('index: ', index);
    fetchPreFillData(index);
    setShowModal(true);
  };

  const handleActivate = async (e) => {
    const tempData = [...tableData];
    const index = tempData[parseInt(e.target.name)];
    try {
      setLoading(true);
      await axiosPrivateInstance.put(`/batch/${index.id}/toggle`, {
        isActive: index.isActive,
      });
      toast.success(
        `${index.User.fullName} has been ${
          index.isActive ? "activated" : "deactivated"
        }`
      );
      index.isActive = !index.isActive;
      setTableData(tempData);
      fetchTableData();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEdit(false);
    setAdd(true);
    setShowModal(true);
    roleId !== "2"
      ? setModalData({ branchId: defaultBranchId })
      : setModalData({});

    if (roleId !== "2") {
      fetchCourseData(defaultBranchId);
      setIsCourseSelectDisabled(false);
    } else {
      setIsCourseSelectDisabled(true);
    }
    setIsFacultySelectDisabled(true);
  };

  const handleOnClose = (e) => {
    if (e.target.id === "outside") {
      setShowModal(false);
      setShowAttendanceModal(false);
      setAdd(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!modalData.name || !modalData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!modalData.branchId || !String(modalData.branchId).trim()) {
      errors.branchId = "Branch is required";
    }
    if (!modalData.courseId || !modalData.courseId) {
      errors.courseId = "Course is required";
    }
    if (!modalData.facultyId || modalData.facultyId.length === 0) {
      errors.facultyId = "Faculty is required";
    }
    if (!modalData.startDate || !modalData.startDate.trim()) {
      errors.startDate = "Start date is required";
    }
    if (!modalData.endDate || !modalData.endDate.trim()) {
      errors.endDate = "End date is required";
    }
    if (!modalData.startTime || !modalData.startTime.trim()) {
      errors.startTime = "Start time is required";
    }
    if (!modalData.endTime || !modalData.endTime.trim()) {
      errors.endTime = "End time is required";
    }

    setErrors(errors);
    console.error(errors);
    console.error(Object.keys(errors).length === 0);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // console.log('modalData: ', modalData);

    setLoading(true);
  

    try {
      if (add) {
        await axiosPrivateInstance.post(`/batch`, modalData);
        toast.success("Faculty added successfully");
        setAdd(false);
      } else if (edit) {
        await axiosPrivateInstance.put(`/batch/${modalData.id}`, modalData);
        toast.success("Faculty updated successfully");
        setEdit(false);
      }
      fetchTableData();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
      setShowModal(false);
      setAdd(false);
      setEdit(false);
    }
    setShowModal(false);
  };

  const SubmitAttendance = async (event) => {
    event.preventDefault();
    console.log("batchId", batchId);
    console.log("defaultBranchId", defaultBranchId);
    console.log("userId", userId);
    console.log("attendanceRecords", attendanceRecords);

    try {
        const body={
            batchId,
            branchId:defaultBranchId,
            userId,
            attendanceRecords
        }
      const response=await axiosPrivateInstance.post(`/student/mark-attendance`, body);
      console.log("response",response)
      toast.success("Attendance marked successfully");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
    setShowAttendanceModal(false);
  };
  const handleAddFormChange = (e) => {
    const tempData = { ...modalData };
    // console.log(tempData);
    if (e.target.name === "branchId") {
      tempData[e.target.name] = e.target.value;
      fetchCourseData(e.target.value);
      setIsCourseSelectDisabled(false);
      setIsFacultySelectDisabled(true);
    } else {
      tempData[e.target.name] = e.target.value;
    }
    setModalData(tempData);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceRecords((prevRecords) => ({
      ...prevRecords,
      [studentId]: status,
    }));
  };
  const fetchAllStudentsbyBatches = async (id) => {
    try {
      const response = await axiosPrivateInstance.post(`/student/bybatch/`, {
        batchId: id,
        facultyId: "31",
      });
      console.log(
        "Student data is here for this batch name, roll no, and id:",
        response.data.data
      );

      const formattedStudents = response.data.data.students.map((student) => ({
        id: student.id,
        rollNumber: student.id,
        name: student.fullName,
      }));

      setStudentsList(formattedStudents);
      console.log("Student list is here:", formattedStudents);

      const initialAttendance = {};
      formattedStudents.forEach((student) => {
        initialAttendance[student.id] = "present"; // Setting initial attendance status
      });
      setAttendanceRecords(initialAttendance);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  const openAttendance = (id) => {
    setShowAttendanceModal(true);
    fetchAllStudentsbyBatches(id);
  };
  return (
    <div className="w-full h-full">
      <AddBanner title={"Batch"} clickHandler={handleAdd} />

      <div className="grid grid-cols-3 gap-5 mt-5">
        <input
          name="searchByName"
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 mb-4 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <select
          name="searchByBranch"
          onChange={(e) => setSearchBranch(e.target.value)}
          value={searchBranch}
          className="px-4 py-2 mb-4 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="" disabled>
            Select branch
          </option>
          {branchData.map((branch, index) => (
            <option key={index} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
        <select
          name="searchByFaculty"
          onChange={(e) => setSearchFaculty(e.target.value)}
          value={searchFaculty}
          className="px-4 py-2 mb-4 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="" disabled>
            Select Faculty
          </option>
          {facultyData.map((branch, index) => (
            <option key={index} value={branch.id}>
              {branch.User.fullName}
            </option>
          ))}
        </select>
      </div>

      <div className="relative mt-8 overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr className="text-center">
              {tableHeading.map((item, index) => (
                <th scope="col" className="px-6 py-3" key={index}>
                  {item.split("_").join(" ")}
                </th>
              ))}
              <th scope="col" className="px-6 py-3">
                Edit
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
              <th scope="col" className="px-6 py-3">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              tableData.map((item, index) => (
                <tr className="bg-white border-b" key={index}>
                  {tableHeading.map((field, i) => (
                    <td className="px-6 py-4 text-center" key={i}>
                      <div className="whitespace-nowrap">
                        {field === "branch"
                          ? item.Branch.name
                          : field === "course"
                          ? item.Course.name
                          : field === "faculty"
                          ? item.Faculties.map(
                              (faculty) => faculty.User.fullName
                            ).join(", ")
                          : item[field] && item[field].length > 30
                          ? item[field].slice(0, 27) + "..."
                          : item[field] || ""}
                      </div>
                    </td>
                  ))}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={handleEditButton}
                      name={index}
                      className="py-1 px-2 rounded-md bg-primary text-white/80 cursor-pointer"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={handleActivate}
                      value={item.isActive}
                      name={index}
                      className={`py-1 px-2 rounded-md text-white/80 cursor-pointer ${
                        item.isActive ? "bg-red-900" : "bg-green-600"
                      }`}
                    >
                      {item.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        openAttendance(item.id);
                        setBatchId(item.id);
                      }}
                      name={index}
                      className="py-1 px-2 rounded-md bg-primary text-white/80 cursor-pointer"
                    >
                      Mark Attendance
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-[9999] flex justify-center items-center overflow-auto"
          id="outside"
          onClick={handleOnClose}
        >
          <div className="shadow-lg h-7/8 w-6/12 mx-auto bg-white rounded-xl p-8 overflow-y-auto z-[40000]">
            <div className="text-center text-3xl font-bold mb-8">
              {add ? "Add" : "Edit"} Batch
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <div className="flex justify-between flex-wrap">
                  <div className="flex flex-col gap-2 w-[49%]">
                    <label htmlFor="name">Name*</label>
                    <input
                      type="text"
                      name="name"
                      maxLength={50}
                      placeholder={`Enter batch name...`}
                      onChange={handleAddFormChange}
                      value={modalData.name || ""}
                      className="form-control w-full"
                    />
                    {errors.name && (
                      <span className="text-sm text-red-500">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-[49%]">
                    <label htmlFor="branch">Branch*</label>
                    <select
                      disabled={roleId !== "2"}
                      className="form-control w-full"
                      name="branchId"
                      id="branchId"
                      onChange={handleAddFormChange}
                      value={modalData.branchId || ""}
                    >
                      <option value="" disabled>
                        Select branch
                      </option>
                      {branchData.map((branch, index) => (
                        <option key={index} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                    {errors.branchId && (
                      <span className="text-sm text-red-500">
                        {errors.branchId}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between flex-wrap mt-5">
                  <div className="flex flex-col gap-2 w-[49%]">
                    <label htmlFor="courseId">Course*</label>
                    <Select
                      className="form-control w-full"
                      id="courseId"
                      name="courseId"
                      value={
                        courseData.find(
                          (course) => course.value === modalData.courseId
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        // console.log('selectedOption', selectedOption);
                        const selectedCourse = courseData.find(
                          (course) => course.value === selectedOption.value
                        );
                        // console.log('selectedCourse', selectedCourse);
                        setModalData((prevData) => ({
                          ...prevData,
                          courseId: selectedOption.value,
                          modules: selectedCourse.modules,
                        }));
                        fetchFacultyData(selectedCourse.modules);
                        setIsFacultySelectDisabled(false);
                      }}
                      options={courseData}
                      isDisabled={isCourseSelectDisabled}
                    />
                    {errors.courseId && (
                      <span className="text-sm text-red-500">
                        {errors.courseId}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-[49%]">
                    <label htmlFor="facultyId">Faculty*</label>
                    <Select
                      name="facultyId"
                      value={
                        facultyOptions.find((faculty) => faculty.value===modalData.facultyId || null)
                      }
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions.map(
                          (option) => option.value
                        );
                        setModalData((prevData) => ({
                          ...prevData,
                          facultyId: selectedValues,
                        }));
                      }}
                      options={facultyOptions}
                      isDisabled={isFacultySelectDisabled}
                      isMulti
                      className="form-control w-full"
                    />
                    {errors.facultyId && (
                      <span className="text-sm text-red-500">
                        {errors.facultyId}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between flex-wrap mt-5">
                  <div className="flex flex-col gap-2 w-[49%]">
                    <label htmlFor="startDate">Start Date*</label>
                    <input
                      type="date"
                      name="startDate"
                      placeholder={`Select start date...`}
                      onChange={handleAddFormChange}
                      value={modalData.startDate || ""}
                      className="form-control w-full"
                    />
                    {errors.startDate && (
                      <span className="text-sm text-red-500">
                        {errors.startDate}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 w-[49%]">
                    <label htmlFor="endDate">End Date*</label>
                    <input
                      type="date"
                      name="endDate"
                      placeholder={`Select end date...`}
                      onChange={handleAddFormChange}
                      value={modalData.endDate || ""}
                      className="form-control w-full"
                    />
                    {errors.endDate && (
                      <span className="text-sm text-red-500">
                        {errors.endDate}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between flex-wrap mt-5">
                  <div className="flex flex-col gap-2 w-[49%]">
                    <label htmlFor="timing">Start Time*</label>
                    <input
                      type="time"
                      name="startTime"
                      placeholder={`Select start time...`}
                      onChange={handleAddFormChange}
                      value={modalData.startTime || ""}
                      className="form-control w-full"
                    />
                    {errors.startTime && (
                      <span className="text-sm text-red-500">
                        {errors.startTime}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 w-[49%]">
                    <label htmlFor="timing">End Time*</label>
                    <input
                      type="time"
                      name="endTime"
                      placeholder={`Select end time...`}
                      onChange={handleAddFormChange}
                      value={modalData.endTime || ""}
                      className="form-control w-full"
                    />
                    {errors.endTime && (
                      <span className="text-sm text-red-500">
                        {errors.endTime}
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full flex justify-center items-center">
                  <button
                    type="submit"
                    className="mt-8 py-4 px-12 rounded-md text-xl bg-primary text-white w-full"
                  >
                    {loading ? <span>Loading...</span> : <span>Submit</span>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAttendanceModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-[9999] flex justify-center items-center overflow-auto"
          id="outside"
          onClick={handleOnClose}
        >
          <div className="shadow-lg h-[90vh] w-full max-w-3xl mx-auto bg-white rounded-xl p-6 md:p-8 overflow-y-auto z-[40000]">
            <div className="text-center text-2xl md:text-3xl font-bold mb-6">
              {add ? "Add" : "Edit"} Attendance
            </div>

            <form onSubmit={SubmitAttendance}>
              <div className="flex flex-col">
                {/* Students List for Attendance */}
                {studentsList.length > 0 ? (
                  <div className="mt-6">
                    <h3 className="text-xl md:text-2xl mb-4">
                      Mark Attendance
                    </h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border px-4 py-2">Roll Number</th>
                          <th className="border px-4 py-2">Name</th>
                          <th className="border px-4 py-2">Present</th>
                          <th className="border px-4 py-2">Absent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentsList.map((student) => (
                          <tr key={student.id}>
                            <td className="border px-4 py-2">
                              {student.rollNumber}
                            </td>
                            <td className="border px-4 py-2">{student.name}</td>
                            <td className="border px-4 py-2 text-center">
                              <input
                                type="radio"
                                name={`attendance_${student.id}`}
                                value="present"
                                checked={
                                  attendanceRecords[student.id] === "present"
                                }
                                onChange={() =>
                                  handleAttendanceChange(student.id, "present")
                                }
                              />
                            </td>
                            <td className="border px-4 py-2 text-center">
                              <input
                                type="radio"
                                name={`attendance_${student.id}`}
                                value="absent"
                                checked={
                                  attendanceRecords[student.id] === "absent"
                                }
                                onChange={() =>
                                  handleAttendanceChange(student.id, "absent")
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {errors.students && (
                      <span className="text-sm text-red-500">
                        {errors.students}
                      </span>
                    )}
                  </div>
                ) : modalData.batch === "" ? (
                  <div className="mt-6">
                    <h6 className="text-xl md:text-2xl mb-4">
                      Select Course and Batch
                    </h6>
                  </div>
                ) : (
                  <div className="mt-6">
                    <h6 className="text-xl md:text-2xl mb-4">
                      No students in this batch
                    </h6>
                  </div>
                )}

                {/* Submit Button */}
                <div className="w-full flex justify-center items-center mt-8">
                  <button
                    type="submit"
                    className="py-3 px-6 rounded-md text-lg bg-primary text-white w-full"
                  >
                    {loading ? <span>Loading...</span> : <span>Submit</span>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading && <ButtonSpinner />}
    </div>
  );
};

export default Batch;
