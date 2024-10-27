import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ButtonSpinner from "../components/common/ButtonSpinner";
import axiosPrivateInstance from "../utils/axiosConfig";
import AddBanner from "../components/common/AddBanner";
import PaymentModal from "../components/PaymentModal";
const roleId = localStorage.getItem("roleId");
const branchId = localStorage.getItem("branchId");
const fetchFrom = roleId !== "2" ? "branch" : "institute";

const tableHeading = [
  "fullName",
  "mobile",
  "email",
  "branch",
  "course",
  "batch",
];

const Student = () => {
  const [tableData, setTableData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [allCourseData, setAllCourseData] = useState([]);
  const [allBatchData, setAllBatchData] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [modalData, setModalData] = useState({ Address: { country: "India" } });
  const [registrationModalData, setRegistrationModalData] = useState({});
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBranch, setSearchBranch] = useState("");
  const [searchBatch, setSearchBatch] = useState("");
  const [searchCourse, setSearchCourse] = useState("");
  const [isCourseSelectDisabled, setIsCourseSelectDisabled] = useState(true);
  const [isBatchSelectDisabled, setIsBatchSelectDisabled] = useState(true);
  const [stateData, setStateData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isNew, setIsNew] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentModalEdit, setIsPaymentModalEdit] = useState(false);
  const [paymentData, setPaymentData] = useState({});

  const [isMobileExist, setIsMobileExist] = useState(null);
  const [error, setError] = useState("");

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivateInstance.get(
        `/student/${fetchFrom}?name=${searchQuery}&branch=${searchBranch}&courseName=${searchCourse}&batch=${searchBatch}`
      );
      console.log(response.data.data);
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
          ? branches.filter((branch) => branch.id === Number(branchId))
          : branches.filter((branch) => branch.isActive === true);
      setBranchData(activeBranch);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const fetchAllCourseData = async () => {
    try {
      const response = await axiosPrivateInstance.get(`/course/${fetchFrom}`);
      console.log("hvjhfbwiubkjqe", response.data);
      const courses = response.data.data;
      const activeCourses = courses.filter((course) => course.isActive);
      console.log("activeCourses", activeCourses);
      setAllCourseData(activeCourses);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const fetchAllBatchData = async () => {
    try {
      const response = await axiosPrivateInstance.get(`/batch/${fetchFrom}`);
      const batches = response.data.data;
      const activeBatch = batches.filter((batch) => batch.isActive);
      setAllBatchData(activeBatch);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const fetchStates = async () => {
    try {
      const state = await axiosPrivateInstance.get("/master/states");
      // console.log(state.data.data);
      setStateData(state.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTableData();
    fetchBranchData();
    fetchAllCourseData();
    fetchAllBatchData();
    fetchStates();
  }, []);

  useEffect(() => {
    fetchTableData();
  }, [searchQuery, searchBranch, searchCourse, searchBatch]);

  const fetchCourseData = async (branchId) => {
    try {
      const response = await axiosPrivateInstance.get(
        `/course/branch/${branchId}`
      );
      const courses = response.data.data;
      const activeCourses = courses.filter((course) => course.isActive);
      console.log(activeCourses);
      setCourseData(activeCourses);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const fetchBatchData = async (courseId) => {
    try {
      const response = await axiosPrivateInstance.get(
        `/batch/course/${courseId}`
      );
      const batches = response.data.data;
      const activeBatch = batches.filter((batch) => batch.isActive);
      setBatchData(activeBatch);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const fetchPreFillData = (index) => {
    const selectedTableData = tableData.find((item) => item.id === index.id);
    // console.log('selectedTableData: ', selectedTableData);
    setModalData(selectedTableData);
    if (selectedTableData.branchId) {
      fetchCourseData(selectedTableData.branchId);
    }
    if (selectedTableData.courseId) {
      fetchBatchData(selectedTableData.courseId);
    }
  };

  const handleEditButton = (e) => {
    setAdd(false);
    setEdit(true);
    const index = tableData[parseInt(e.target.name)];
    fetchPreFillData(index);
    setShowEditModal(true);
  };

  const handleActivate = async (e) => {
    const tempData = [...tableData];
    const index = tempData[parseInt(e.target.name)];
    try {
      setLoading(true);
      await axiosPrivateInstance.put(`/student/${index.id}/toggle`, {
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
    roleId == "2"
      ? setModalData({ branchId: branchId, Address: { country: "India" } })
      : setModalData({ Address: { country: "India" } });
    if (roleId == "2") {
      fetchCourseData(branchId);
      setIsCourseSelectDisabled(false);
    } else {
      setIsCourseSelectDisabled(true);
    }
    setIsBatchSelectDisabled(true);
  };

  const handleOnClose = (e) => {
    if (e.target.id === "outside") {
      setShowModal(false);
      setShowEditModal(false);
      setAdd(false);
      setErrors({});
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!modalData.User?.fullName?.trim()) {
      errors.name = "Name is required";
    }

    if (!modalData.User?.mobile?.trim()) {
      errors.mobile = "Mobile no is required";
    } else if (modalData.User.mobile.length !== 10) {
      errors.mobile = "Mobile no should be 10 digits";
    }

    if (!modalData.User?.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(modalData.User.email)) {
      errors.email = "Email is invalid";
    }

    if (
      !modalData.Address?.address ||
      typeof modalData.Address.address !== "string" ||
      !modalData.Address.address.trim()
    ) {
      errors.address = "Address is required";
    } else if (modalData.Address.address.length > 100) {
      errors.address = "Address should not exceed 100 characters";
    }

    if (
      !modalData.Address?.city ||
      typeof modalData.Address.city !== "string" ||
      !modalData.Address.city.trim()
    ) {
      errors.city = "City is required";
    } else if (modalData.Address.city.length > 20) {
      errors.city = "City should not exceed 20 characters";
    }

    if (
      !modalData.Address?.state ||
      typeof modalData.Address.state !== "string" ||
      !modalData.Address.state.trim()
    ) {
      errors.state = "State is required";
    }

    if (
      !modalData.Address?.postalCode ||
      typeof modalData.Address.postalCode !== "string" ||
      !modalData.Address.postalCode.trim()
    ) {
      errors.postalCode = "Postal code is required";
    } else if (modalData.Address.postalCode.length !== 6) {
      errors.postalCode = "Postal code should be 6 digits";
    }

    if (!modalData.branchId) {
      errors.branchId = "Branch is required";
    }

    if (!modalData.courseId || modalData.courseId.length === 0) {
      errors.courseId = "Course is required";
    }

    if (!modalData.batchId || modalData.batchId.length === 0) {
      errors.batchId = "Batch is required";
    }

    if (!modalData.admissionNo || !modalData.admissionNo.trim()) {
      errors.admission = "Admission no is required";
    }

    if (modalData.Parents && modalData.Parents.length > 0) {
      modalData.Parents.forEach((parent, index) => {
        if (!parent?.name?.trim()) {
          errors.Parents = errors.Parents || [];
          errors.Parents[index] = errors.Parents[index] || {};
          errors.Parents[index].name = "Parent name is required";
        }

        if (!parent?.relation?.trim()) {
          errors.Parents = errors.Parents || [];
          errors.Parents[index] = errors.Parents[index] || {};
          errors.Parents[index].relation = "Relation is required";
        }

        if (!parent?.mobile?.trim()) {
          errors.Parents = errors.Parents || [];
          errors.Parents[index] = errors.Parents[index] || {};
          errors.Parents[index].mobile = "Mobile no is required";
        } else if (parent.mobile.length !== 10) {
          errors.Parents = errors.Parents || [];
          errors.Parents[index] = errors.Parents[index] || {};
          errors.Parents[index].mobile = "Mobile no should be 10 digits";
        }

        if (!parent?.email?.trim()) {
          errors.Parents = errors.Parents || [];
          errors.Parents[index] = errors.Parents[index] || {};
          errors.Parents[index].email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(parent.email)) {
          errors.Parents = errors.Parents || [];
          errors.Parents[index] = errors.Parents[index] || {};
          errors.Parents[index].email = "Email is invalid";
        }
      });
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("modalData: ", modalData);

    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // console.log('paymentData: ', paymentData);
    if (add && (!paymentData || Object.keys(paymentData).length === 0)) {
      toast.error("Please enter payment details");
      setLoading(false);
      return;
    }

    const finalData = {
      ...modalData,
      ...paymentData,
    };

    console.log("finalData: ", finalData);
    // setLoading(false)
    // return;

    try {
      if (add) {
        await axiosPrivateInstance.post(`/student`, finalData);
        toast.success("Student added successfully");
        setAdd(false);
      } else if (edit) {
        await axiosPrivateInstance.put(`/student/${modalData.id}`, modalData);
        toast.success("Student updated successfully");
        setEdit(false);
      }
      fetchTableData();
      setAdd(false);
      setEdit(false);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
    setShowModal(false);
  };

  const handleAddFormChange = (e) => {
    console.log("modalData: ", modalData);
    const tempData = { ...modalData };
    if (e.target.name.includes("Address")) {
      tempData["Address"] = tempData["Address"] || {};
      tempData["Address"][e.target.name.split(".")[1]] = e.target.value;
    } else if (e.target.name.includes("User")) {
      tempData["User"] = tempData["User"] || {};
      tempData["User"][e.target.name.split(".")[1]] = e.target.value;
    } else if (e.target.name.includes("Parents")) {
      const parentIndex = parseInt(e.target.name.split(".")[1]);
      const field = e.target.name.split(".")[2];
      tempData["Parents"] = tempData["Parents"] || [];
      tempData["Parents"][parentIndex] = tempData["Parents"][parentIndex] || {};
      tempData["Parents"][parentIndex][field] = e.target.value;
    } else if (e.target.name === "branchId") {
      setCourseData([]);
      tempData[e.target.name] = e.target.value;
      fetchCourseData(e.target.value);
      setIsCourseSelectDisabled(false);
    } else if (e.target.name === "courseId") {
      setBatchData([]);
      tempData[e.target.name] = e.target.value;
      fetchBatchData(e.target.value);
      setIsBatchSelectDisabled(false);
    } else {
      tempData[e.target.name] = e.target.value;
    }
    setModalData(tempData);
  };

  const handleAddParent = () => {
    const tempData = { ...modalData };
    tempData["Parents"] = tempData["Parents"] || [];
    tempData["Parents"].push({});
    setModalData(tempData);
  };

  const filterTableData = () => {
    return tableData.filter((item) => {
      const matchesName = searchQuery
        ? item.User?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesBranch = searchBranch
        ? item.branchId === searchBranch
        : true;
      const matchesCourse = searchCourse
        ? item.courseId === searchCourse
        : true;
      const matchesBatch = searchBatch ? item.batchId === searchBatch : true;

      return matchesName && matchesBranch && matchesCourse && matchesBatch;
    });
  };

  const fetchStudentData = async () => {
    try {
      const response = await axiosPrivateInstance.get(`/student/institute`);
      const students = response.data.data;
      console.log("students: ", students);

      const recentStudentsMap = new Map();

      students.forEach((student) => {
        const existingStudent = recentStudentsMap.get(student.userId);
        if (
          !existingStudent ||
          new Date(student.createdAt) > new Date(existingStudent.createdAt)
        ) {
          recentStudentsMap.set(student.userId, student);
        }
      });

      const activeStudents =
        roleId !== "2"
          ? Array.from(recentStudentsMap.values()).filter(
              (student) => student.branchId === Number(branchId)
            )
          : Array.from(recentStudentsMap.values()).filter(
              (student) => student.isActive === true
            );

      console.log("studentData: ", activeStudents);
      setStudentData(activeStudents);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [isNew]);

  const handleRegistrationSubmit = async (event) => {
    event.preventDefault();

    const finalData = { registrationModalData, paymentData };
    console.log("registrationModalData: ", finalData);

    setLoading(true);

    console.log("paymentData: ", paymentData);
    if (!paymentData || Object.keys(paymentData).length === 0) {
      toast.error("Please enter payment details");
      setLoading(false);
      return;
    }

    try {
      await axiosPrivateInstance.post(`/student/new-registration`, finalData);
      toast.success("Registration successful");
      fetchTableData();
      setIsNew(true);
      setIsPaymentModalOpen(false);
      setIsPaymentModalEdit(false);
      setRegistrationModalData({});
      setPaymentData({});
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
    setShowModal(false);
  };

  const handlePaymentFormChange = (e) => {
    console.log("registrationModalData: ", registrationModalData);
    const tempData = { ...registrationModalData };
    if (e.target.name.includes("User")) {
      tempData["User"] = tempData["User"] || {};
      tempData["User"][e.target.name.split(".")[1]] = e.target.value;
    } else if (e.target.name === "branchId") {
      setCourseData([]);
      tempData[e.target.name] = e.target.value;
      fetchCourseData(e.target.value);
      setIsCourseSelectDisabled(false);
    } else if (e.target.name === "courseId") {
      // setBatchData([]);
      tempData[e.target.name] = e.target.value;
      fetchBatchData(e.target.value);
      setIsBatchSelectDisabled(false);
    } else {
      tempData[e.target.name] = e.target.value;
    }
    setRegistrationModalData(tempData);
  };

  const checkMobileNumber = async (mobileNumber) => {
    try {
      // Make an API call to check if the mobile number exists in the database
      const response = await axiosPrivateInstance.post("/student/mobile", {
        mobile: mobileNumber,
      });

      // Handle the API response
      if (response.data.exists) {
        setIsMobileExist(true);
        setError("Mobile number already exists.");
      } else {
        setIsMobileExist(false);
        setError("");
      }
    } catch (error) {
      console.error("Error checking mobile number:", error);
      setError("Failed to verify mobile number. Please try again.");
    }
  };

  const handleBlur = () => {
    let mobileNumber = modalData["User"]["mobile"];
    if (mobileNumber.length == 10) {
      checkMobileNumber(mobileNumber);
    } else {
      alert("Enter valid Number");
    }
  };

  return (
    <div className="w-full h-full">
      <AddBanner title={"Admission"} clickHandler={handleAdd} />

      <div className="grid grid-cols-4 gap-5 mt-5">
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
          name="searchByCourse"
          onChange={(e) => setSearchCourse(e.target.value)}
          value={searchCourse}
          className="px-4 py-2 mb-4 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="" disabled>
            Select course
          </option>
          {allCourseData.map((course, index) => (
            <option key={index} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <select
          name="searchByBatch"
          onChange={(e) => setSearchBatch(e.target.value)}
          value={searchBatch}
          className="px-4 py-2 mb-4 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="" disabled>
            Select batch
          </option>
          {allBatchData.map((batch, index) => (
            <option key={index} value={batch.id}>
              {batch.name}
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
                          ? item.Branch?.name
                          : field === "course"
                          ? item.Course?.name
                          : field === "batch"
                          ? item.Batch?.name
                          : item.User[field] && item.User[field].length > 30
                          ? item.User[field].slice(0, 27) + "..."
                          : item.User[field] ||
                            (item[field] && item[field].length > 30
                              ? item[field].slice(0, 27) + "..."
                              : item[field] || "")}
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
          <div className="shadow-lg h-[90vh] w-10/12 mx-auto bg-white rounded-xl p-8 overflow-y-auto z-[40000]">
            <div className="flex justify-between items-center">
              <div className="text-center text-3xl font-bold">
                {isNew ? "New" : "Exiting"} Admission
              </div>

              <div className="flex justify-center items-center">
                <div className="flex items-center me-4">
                  <input
                    id="inline-radio"
                    type="radio"
                    defaultChecked={isNew}
                    value={isNew}
                    name="inline-radio-group"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    onClick={() => setIsNew(true)}
                  />
                  <label
                    htmlFor="inline-radio"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    New
                  </label>
                </div>
                <div className="flex items-center me-4">
                  <input
                    id="inline-2-radio"
                    type="radio"
                    defaultChecked={!isNew}
                    value={isNew}
                    name="inline-radio-group"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    onClick={() => setIsNew(false)}
                  />
                  <label
                    htmlFor="inline-2-radio"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Existing
                  </label>
                </div>
              </div>
            </div>

            {isNew && (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <div className="grid grid-cols-3 gap-5 mt-10">
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="fullName">Name*</label>
                      <input
                        type="text"
                        name="User.fullName"
                        maxLength={50}
                        placeholder={`Enter student name...`}
                        onChange={handleAddFormChange}
                        value={
                          (modalData["User"]
                            ? modalData["User"]["fullName"]
                            : "") || ""
                        }
                        className="form-control w-full"
                      />
                      {errors.name && (
                        <span className="text-sm text-red-500">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="admissionNo">Admission Number*</label>
                      <input
                        type="text"
                        name="admissionNo"
                        max={20}
                        placeholder={`Enter admission number...`}
                        onChange={handleAddFormChange}
                        value={modalData.admissionNo || ""}
                        className="form-control w-full"
                      />
                      {errors.admission && (
                        <span className="text-sm text-red-500">
                          {errors.admission}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        name="User.email"
                        placeholder={"Enter email..."}
                        onChange={handleAddFormChange}
                        value={
                          (modalData["User"]
                            ? modalData["User"]["email"]
                            : "") || ""
                        }
                        className="form-control w-full"
                      />
                      {errors.email && (
                        <span className="text-sm text-red-500">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="mobile">Mobile*</label>
                      <input
                        type="number"
                        name="User.mobile"
                        maxLength={10}
                        placeholder={"Enter mobile no..."}
                        onChange={handleAddFormChange}
                        value={
                          (modalData["User"]
                            ? modalData["User"]["mobile"]
                            : "") || ""
                        }
                        onBlur={handleBlur}
                        className="form-control w-full"
                      />
                      {/* {errors.mobile && <span className="text-sm text-red-500">{errors.mobile}</span>} */}
                      {isMobileExist && <span className="error">{error}</span>}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="branchId">Branch</label>
                      <select
                        disabled={roleId !== "2"}
                        name="branchId"
                        onChange={handleAddFormChange}
                        value={modalData.Branch?.id || modalData.branchId || ""}
                        className="form-control w-full"
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

                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="courseId">Course*</label>
                      <select
                        disabled={isCourseSelectDisabled}
                        name="courseId"
                        onChange={handleAddFormChange}
                        value={modalData.Course?.id || modalData.courseId || ""}
                        className="form-control w-full"
                      >
                        <option value="" disabled>
                          Select course
                        </option>
                        {courseData.map((course, index) => (
                          <option key={index} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                      {errors.courseId && (
                        <span className="text-sm text-red-500">
                          {errors.courseId}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="batchId">Batch*</label>
                      <select
                        disabled={isBatchSelectDisabled}
                        name="batchId"
                        onChange={handleAddFormChange}
                        value={modalData.Batch?.id || modalData.batchId || ""}
                        className="form-control w-full"
                      >
                        <option value="" disabled>
                          Select batch
                        </option>
                        {batchData.map((batch, index) => (
                          <option key={index} value={batch.id}>
                            {batch.name}
                          </option>
                        ))}
                      </select>
                      {errors.batchId && (
                        <span className="text-sm text-red-500">
                          {errors.batchId}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="address">Address</label>
                      <input
                        type="text"
                        name="Address.address"
                        maxLength={100}
                        placeholder={"Enter address..."}
                        onChange={handleAddFormChange}
                        value={
                          (modalData["Address"]
                            ? modalData["Address"]["address"]
                            : "") || ""
                        }
                        className="form-control w-full"
                      />
                      {errors.address && (
                        <span className="text-sm text-red-500">
                          {errors.address}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        name="Address.city"
                        max={20}
                        placeholder={`Enter city...`}
                        onChange={handleAddFormChange}
                        value={
                          (modalData["Address"]
                            ? modalData["Address"]["city"]
                            : "") || ""
                        }
                        className="form-control w-full"
                      />
                      {errors.city && (
                        <span className="text-sm text-red-500">
                          {errors.city}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="state">State</label>
                      <select
                        name="Address.state"
                        onChange={handleAddFormChange}
                        value={
                          (modalData["Address"]
                            ? modalData["Address"]["state"]
                            : "") || ""
                        }
                        className="form-control w-full"
                      >
                        <option value="" disabled>
                          Select state
                        </option>
                        {stateData.map((state, index) => (
                          <option key={index} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <span className="text-sm text-red-500">
                          {errors.state}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="country">Country</label>
                      <input
                        type="text"
                        name="Address.country"
                        placeholder={`Enter country...`}
                        //disabled
                        onChange={handleAddFormChange}
                        value={
                          (modalData["Address"]
                            ? modalData["Address"]["country"]
                            : "India") || "India"
                        }
                        className="form-control w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="postalCode">Postal Code</label>
                      <input
                        type="number"
                        name="Address.postalCode"
                        maxLength={6}
                        placeholder={`Enter postal code...`}
                        onChange={handleAddFormChange}
                        value={
                          (modalData["Address"]
                            ? modalData["Address"]["postalCode"]
                            : "") || ""
                        }
                        className="form-control w-full"
                      />
                      {errors.postalCode && (
                        <span className="text-sm text-red-500">
                          {errors.postalCode}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-[100%] mt-4">
                    <label>Parents:</label>
                    {modalData.Parents?.map((parent, index) => (
                      <div key={index} className="flex flex-col gap-2">
                        <div className="grid grid-cols-4 gap-2">
                          <div className="w-full">
                            <input
                              type="text"
                              name={`Parents.${index}.name`}
                              maxLength={20}
                              placeholder="Parent Name"
                              value={parent.name || ""}
                              onChange={handleAddFormChange}
                              className="w-full rounded-md py-1 px-2 bg-primary/5 outline-none"
                            />
                            {errors?.Parents?.[index]?.name && (
                              <span className="text-sm text-red-500">
                                {errors.Parents[index].name}
                              </span>
                            )}
                          </div>
                          <div className="w-full">
                            <input
                              type="email"
                              name={`Parents.${index}.email`}
                              placeholder="Parent Email"
                              value={parent.email || ""}
                              onChange={handleAddFormChange}
                              className="w-full rounded-md py-1 px-2 bg-primary/5 outline-none"
                            />
                            {errors?.Parents?.[index]?.email && (
                              <span className="text-sm text-red-500">
                                {errors.Parents[index].email}
                              </span>
                            )}
                          </div>
                          <div className="w-full">
                            <input
                              type="number"
                              name={`Parents.${index}.mobile`}
                              placeholder="Parent Mobile"
                              maxLength={10}
                              value={parent.mobile || ""}
                              onChange={handleAddFormChange}
                              className="w-full rounded-md py-1 px-2 bg-primary/5 outline-none"
                            />
                            {errors?.Parents?.[index]?.mobile && (
                              <span className="text-sm text-red-500">
                                {errors.Parents[index].mobile}
                              </span>
                            )}
                          </div>
                          <div className="w-full">
                            <input
                              type="text"
                              name={`Parents.${index}.relation`}
                              maxLength={10}
                              placeholder="Relationship"
                              value={parent.relation || ""}
                              onChange={handleAddFormChange}
                              className="w-full rounded-md py-1 px-2 bg-primary/5 outline-none"
                            />
                            {errors?.Parents?.[index]?.relation && (
                              <span className="text-sm text-red-500">
                                {errors.Parents[index].relation}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddParent}
                      className="mt-2 text-primary hover:underline"
                    >
                      Add Parent
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="mt-2 text-primary hover:underline"
                  >
                    Add Payment Details
                  </button>

                  {isPaymentModalOpen &&
                    (!modalData.courseId ? (
                      toast.error("Please select course")
                    ) : (
                      <PaymentModal
                        baseFees={
                          courseData.find(
                            (course) => course.id === Number(modalData.courseId)
                          )?.baseFees || 0
                        }
                        paymentData={paymentData}
                        setPaymentData={setPaymentData}
                        isOpen={isPaymentModalOpen}
                        onClose={() => setIsPaymentModalOpen(false)}
                        isEdit={isPaymentModalEdit}
                        setIsEdit={setIsPaymentModalEdit}
                      />
                    ))}

                  <div className="w-full flex justify-center items-center">
                    <button
                      type="submit"
                      className="mt-8 py-4 px-12 rounded-md text-xl bg-primary text-white w-full"
                      disabled={loading}
                    >
                      {loading ? <span>Loading...</span> : <span>Submit</span>}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {!isNew && (
              <form onSubmit={handleRegistrationSubmit}>
                <div className="flex flex-col">
                  <div className="grid grid-cols-3 gap-5 mt-10">
                    {/* Student Selection */}
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="fullName">Student*</label>
                      <select
                        name="studentId"
                        onChange={(e) => {
                          handlePaymentFormChange(e);

                          const selectedStudent = studentData.find(
                            (student) => student.id === Number(e.target.value)
                          );
                          console.log("selectedStudent: ", selectedStudent);
                          if (selectedStudent) {
                            setRegistrationModalData({
                              User: selectedStudent.User || {},
                              Branch: selectedStudent.Branch || {},
                              id: selectedStudent.id || "",
                              userId: selectedStudent.userId || "",
                              admissionNo: selectedStudent.admissionNo || "",
                              branchId: selectedStudent.branchId || "",
                            });

                            console.log(selectedStudent.Branch?.id);

                            setCourseData([]);
                            fetchCourseData(selectedStudent.Branch?.id);
                            setIsCourseSelectDisabled(false);
                          }
                        }}
                        value={registrationModalData.id || ""}
                        className="form-control w-full"
                      >
                        <option value="" disabled>
                          Select student
                        </option>
                        {studentData.map((student, index) => (
                          <option key={index} value={student.id}>
                            {student.User.fullName}
                          </option>
                        ))}
                      </select>
                      {errors.name && (
                        <span className="text-sm text-red-500">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Admission Number */}
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="admissionNo">Admission Number*</label>
                      <input
                        type="text"
                        name="admissionNo"
                        maxLength={20}
                        placeholder={`Enter admission number...`}
                        onChange={handlePaymentFormChange}
                        value={registrationModalData.admissionNo || ""}
                        className="form-control w-full"
                        disabled
                      />
                      {errors.admission && (
                        <span className="text-sm text-red-500">
                          {errors.admission}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="email">Email*</label>
                      <input
                        type="email"
                        name="User.email"
                        placeholder={"Enter email..."}
                        onChange={handlePaymentFormChange}
                        value={registrationModalData.User?.email || ""}
                        className="form-control w-full"
                        disabled
                      />
                      {errors.email && (
                        <span className="text-sm text-red-500">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    {/* Mobile */}
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="mobile">Mobile*</label>
                      <input
                        type="number"
                        name="User.mobile"
                        maxLength={10}
                        placeholder={"Enter mobile no..."}
                        onChange={handlePaymentFormChange}
                        value={registrationModalData.User?.mobile || ""}
                        className="form-control w-full"
                        disabled
                      />
                      {errors.mobile && (
                        <span className="text-sm text-red-500">
                          {errors.mobile}
                        </span>
                      )}
                    </div>

                    {/* Branch */}
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="branchId">Branch*</label>
                      <select
                        disabled
                        name="branchId"
                        onChange={handlePaymentFormChange}
                        value={
                          registrationModalData.branchId ||
                          registrationModalData.Branch?.branchId ||
                          ""
                        }
                        className="form-control w-full"
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

                    {/* Course */}
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="courseId">Course*</label>
                      <select
                        disabled={isCourseSelectDisabled}
                        name="courseId"
                        onChange={handlePaymentFormChange}
                        value={
                          registrationModalData.Course?.id ||
                          registrationModalData.courseId ||
                          ""
                        }
                        className="form-control w-full"
                      >
                        <option value="" disabled>
                          Select course
                        </option>
                        {courseData.map((course, index) => (
                          <option key={index} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                      {errors.courseId && (
                        <span className="text-sm text-red-500">
                          {errors.courseId}
                        </span>
                      )}
                    </div>

                    {/* Batch */}
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="batchId">Batch*</label>
                      <select
                        disabled={isBatchSelectDisabled}
                        name="batchId"
                        onChange={handlePaymentFormChange}
                        value={
                          registrationModalData.Batch?.id ||
                          registrationModalData.batchId ||
                          ""
                        }
                        className="form-control w-full"
                      >
                        <option value="" disabled>
                          Select batch
                        </option>
                        {batchData.map((batch, index) => (
                          <option key={index} value={batch.id}>
                            {batch.name}
                          </option>
                        ))}
                      </select>
                      {errors.batchId && (
                        <span className="text-sm text-red-500">
                          {errors.batchId}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="mt-2 text-primary hover:underline"
                  >
                    Add Payment Details
                  </button>

                  {isPaymentModalOpen &&
                    (!registrationModalData.courseId ? (
                      toast.error("Please select course")
                    ) : (
                      <PaymentModal
                        baseFees={
                          courseData.find(
                            (course) =>
                              course.id ===
                              Number(registrationModalData.courseId)
                          )?.baseFees || 0
                        }
                        paymentData={paymentData}
                        setPaymentData={setPaymentData}
                        isOpen={isPaymentModalOpen}
                        onClose={() => setIsPaymentModalOpen(false)}
                        isEdit={isPaymentModalEdit}
                        setIsEdit={setIsPaymentModalEdit}
                      />
                    ))}

                  <div className="w-full flex justify-center items-center">
                    <button
                      type="submit"
                      className="mt-8 py-4 px-12 rounded-md text-xl bg-primary text-white w-full"
                      disabled={loading}
                    >
                      {loading ? <span>Loading...</span> : <span>Submit</span>}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {showEditModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-[9999] flex justify-center items-center overflow-auto"
          id="outside"
          onClick={handleOnClose}
        >
          <div className="shadow-lg h-[90vh] w-10/12 mx-auto bg-white rounded-xl p-8 overflow-y-auto z-[40000]">
            <div className="text-center text-3xl font-bold">Edit Admission</div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <div className="grid grid-cols-3 gap-5 mt-10">
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="fullName">Name</label>
                    <input
                      type="text"
                      name="User.fullName"
                      maxLength={50}
                      placeholder={`Enter student name...`}
                      onChange={handleAddFormChange}
                      value={
                        (modalData["User"]
                          ? modalData["User"]["fullName"]
                          : "") || ""
                      }
                      className="form-control w-full"
                    />
                    {errors.name && (
                      <span className="text-sm text-red-500">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="admissionNo">Admission Number</label>
                    <input
                      type="text"
                      // disabled={edit}
                      name="admissionNo"
                      max={20}
                      placeholder={`Enter admission number...`}
                      onChange={handleAddFormChange}
                      value={modalData.admissionNo || ""}
                      className="form-control w-full"
                    />
                    {errors.admission && (
                      <span className="text-sm text-red-500">
                        {errors.admission}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="User.email"
                      placeholder={"Enter email..."}
                      onChange={handleAddFormChange}
                      value={
                        (modalData["User"] ? modalData["User"]["email"] : "") ||
                        ""
                      }
                      className="form-control w-full"
                    />
                    {errors.email && (
                      <span className="text-sm text-red-500">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="mobile">Mobile</label>
                    <input
                      type="number"
                      name="User.mobile"
                      maxLength={10}
                      placeholder={"Enter mobile no..."}
                      onChange={handleAddFormChange}
                      value={
                        (modalData["User"]
                          ? modalData["User"]["mobile"]
                          : "") || ""
                      }
                      className="form-control w-full"
                    />
                    {errors.mobile && (
                      <span className="text-sm text-red-500">
                        {errors.mobile}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="branchId">Branch</label>
                    <select
                      disabled={roleId !== "2"}
                      name="branchId"
                      onChange={handleAddFormChange}
                      value={modalData.branchId || ""}
                      className="form-control w-full"
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

                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="courseId">Course</label>
                    <select
                      // disabled={isCourseSelectDisabled}
                      name="courseId"
                      onChange={handleAddFormChange}
                      value={modalData.courseId || ""}
                      className="form-control w-full"
                    >
                      <option value="" disabled>
                        Select course
                      </option>
                      {courseData.map((course, index) => (
                        <option key={index} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                    {errors.courseId && (
                      <span className="text-sm text-red-500">
                        {errors.courseId}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="batchId">Batch</label>
                    <select
                      // disabled={isBatchSelectDisabled}
                      name="batchId"
                      onChange={handleAddFormChange}
                      value={modalData.batchId || ""}
                      className="form-control w-full"
                    >
                      <option value="" disabled>
                        Select batch
                      </option>
                      {batchData.map((batch, index) => (
                        <option key={index} value={batch.id}>
                          {batch.name}
                        </option>
                      ))}
                    </select>
                    {errors.batchId && (
                      <span className="text-sm text-red-500">
                        {errors.batchId}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      name="Address.address"
                      maxLength={100}
                      placeholder={"Enter address..."}
                      onChange={handleAddFormChange}
                      value={
                        (modalData["Address"]
                          ? modalData["Address"]["address"]
                          : "") || ""
                      }
                      className="form-control w-full"
                    />
                    {errors.address && (
                      <span className="text-sm text-red-500">
                        {errors.address}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      name="Address.city"
                      max={20}
                      placeholder={`Enter city...`}
                      onChange={handleAddFormChange}
                      value={
                        (modalData["Address"]
                          ? modalData["Address"]["city"]
                          : "") || ""
                      }
                      className="form-control w-full"
                    />
                    {errors.city && (
                      <span className="text-sm text-red-500">
                        {errors.city}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="state">State</label>
                    <select
                      name="Address.state"
                      onChange={handleAddFormChange}
                      value={
                        (modalData["Address"]
                          ? modalData["Address"]["state"]
                          : "") || ""
                      }
                      className="form-control w-full"
                    >
                      <option value="" disabled>
                        Select state
                      </option>
                      {stateData.map((state, index) => (
                        <option key={index} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <span className="text-sm text-red-500">
                        {errors.state}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      name="Address.country"
                      placeholder={`Enter country...`}
                      // disabled
                      onChange={handleAddFormChange}
                      value={
                        (modalData["Address"]
                          ? modalData["Address"]["country"]
                          : "India") || "India"
                      }
                      className="form-control w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      type="number"
                      name="Address.postalCode"
                      maxLength={6}
                      placeholder={`Enter postal code...`}
                      onChange={handleAddFormChange}
                      value={
                        (modalData["Address"]
                          ? modalData["Address"]["postalCode"]
                          : "") || ""
                      }
                      className="form-control w-full"
                    />
                    {errors.postalCode && (
                      <span className="text-sm text-red-500">
                        {errors.postalCode}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-[100%] mt-4">
                  <label>Parents:</label>
                  {modalData.Parents?.map((parent, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="grid grid-cols-4 gap-2">
                        <div className="w-full">
                          <input
                            type="text"
                            name={`Parents.${index}.name`}
                            maxLength={20}
                            placeholder="Parent Name"
                            value={parent.name || ""}
                            onChange={handleAddFormChange}
                            className="w-full rounded-md py-1 px-2 bg-primary/5 outline-none"
                          />
                          {errors?.Parents?.[index]?.name && (
                            <span className="text-sm text-red-500">
                              {errors.Parents[index].name}
                            </span>
                          )}
                        </div>
                        <div className="w-full">
                          <input
                            type="email"
                            name={`Parents.${index}.email`}
                            placeholder="Parent Email"
                            value={parent.email || ""}
                            onChange={handleAddFormChange}
                            className="w-full rounded-md py-1 px-2 bg-primary/5 outline-none"
                          />
                          {errors?.Parents?.[index]?.email && (
                            <span className="text-sm text-red-500">
                              {errors.Parents[index].email}
                            </span>
                          )}
                        </div>
                        <div className="w-full">
                          <input
                            type="number"
                            name={`Parents.${index}.mobile`}
                            placeholder="Parent Mobile"
                            maxLength={10}
                            value={parent.mobile || ""}
                            onChange={handleAddFormChange}
                            className="w-full rounded-md py-1 px-2 bg-primary/5 outline-none"
                          />
                          {errors?.Parents?.[index]?.mobile && (
                            <span className="text-sm text-red-500">
                              {errors.Parents[index].mobile}
                            </span>
                          )}
                        </div>
                        <div className="w-full">
                          <input
                            type="text"
                            name={`Parents.${index}.relation`}
                            maxLength={10}
                            placeholder="Relationship"
                            value={parent.relation || ""}
                            onChange={handleAddFormChange}
                            className="w-full rounded-md py-1 px-2 bg-primary/5 outline-none"
                          />
                          {errors?.Parents?.[index]?.relation && (
                            <span className="text-sm text-red-500">
                              {errors.Parents[index].relation}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddParent}
                    className="mt-2 text-primary hover:underline"
                  >
                    Add Parent
                  </button>
                </div>

                <div className="w-full flex justify-center items-center">
                  <button
                    type="submit"
                    className="mt-8 py-4 px-12 rounded-md text-xl bg-primary text-white w-full"
                    disabled={loading}
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

export default Student;
