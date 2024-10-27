import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ButtonSpinner from "../components/common/ButtonSpinner";
import axiosPrivateInstance from "../utils/axiosConfig";
import AddBanner from "../components/common/AddBanner";

const roleId = localStorage.getItem("roleId");
const defaultBranchId = localStorage.getItem("branchId");

const fetchFrom = roleId !== "2" ?  "institute": "branch" ;





const tableHeading = [
    "name",
    "email",
    "mobileno",
    "branch",
    
  ];

const StudentRegister = () =>{
const [showModal, setShowModal] = useState(false);
const [tableData,setTableData] = useState([]);
const [searchBranch, setSearchBranch] = useState("");
const [add, setAdd] = useState(false);
const [edit, setEdit] = useState(false);
const [modalData, setModalData] = useState({
    name: "",
    email: "",
    mobileno: "",
    branch: ""
  });
const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState({});
const [searchQuery, setSearchQuery] = useState("");
const [branchData, setBranchData] = useState([]);





const fetchTableData = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivateInstance.get(
        `/registerStudent/${fetchFrom}?name=${encodeURIComponent(searchQuery)}&branch=${encodeURIComponent(searchBranch)}`
      );
      console.log(response.data);

      setTableData(response.data);
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

useEffect(()=>{
     fetchTableData();
     fetchBranchData();
},[])

useEffect(() => {
    fetchTableData();
  }, [searchBranch, searchQuery]);


const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "branchId") {
        // Find the selected branch name and store its name instead of ID
        const selectedBranch = branchData.find(branch => branch.id === parseInt(e.target.value));
        setModalData(prevState => ({
          ...prevState,
          branchId: selectedBranch ? selectedBranch.id : "", // Store the branch ID
          branch: selectedBranch ? selectedBranch.name : "", // Store the full branch name
        }));
      }
      else{
        setModalData((prevState) => ({
            ...prevState,
            [name]: value,
          }));
      }
      console.log(modalData)
};

const fetchPreFillData = async (index) => {
    const selectedTableData = tableData.find((item) => item.id === index.id);
    setModalData(selectedTableData);
  };

const handleEditButton = (e) => {
    setAdd(false);
    setEdit(true);
    const index = tableData[parseInt(e.target.name)];
    // console.log('index: ', index);
    fetchPreFillData(index);
    setShowModal(true);
  };

const handleAdd = () => {
    setEdit(false);
    setAdd(true);
    setShowModal(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // console.log('modalData: ', modalData);

    setLoading(true);
  

    try {
      if (add) {
        await axiosPrivateInstance.post(`/registerStudent`, modalData);
        toast.success("Student added successfully");
        setAdd(false);
      } else if (edit) {
        await axiosPrivateInstance.put(`/registerStudent/updateRegister`, modalData);
        toast.success("Student updated successfully");
        setEdit(false);
        setModalData({
            name: "",
          email: "",
          mobileno: "",
          branch: ""
          });
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

  const handleOnClose = (e) => {
    if (e.target.id === "outside") {
      setShowModal(false);
     
      setAdd(false);

      setModalData({
        name: "",
      email: "",
      mobileno: "",
      branch: ""
      });
    }
  };

  console.log(searchBranch);

return (
    <div className="w-full h-full">
      <AddBanner title={"Registration"} clickHandler={handleAdd} />

      <div className="grid grid-cols-3 gap-5 mt-5">
        <input
          name="searchByName"
          type="text"
          placeholder="Search by name..."
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
       
          className="px-4 py-2 mb-4 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <select
          name="searchByBranch"
          onChange={(e) => {
    const selectedBranch = branchData.find((branch) => branch.id === parseInt(e.target.value));
    setSearchBranch(selectedBranch ? selectedBranch.name : ""); // Store the full branch name
  }}
  value={searchBranch || ""} // Set the value to the full branch name
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
             
            </tr>
          </thead>
          <tbody>
            {!loading &&
              tableData.map((item, index) => (
                <tr className="bg-white border-b" key={index}>
                  {tableHeading.map((field, i) => (
                    <td className="px-6 py-4 text-center" key={i}>
                      <div className="whitespace-nowrap">
                        {field === "name"
                          ? item.name
                          : field === "email"
                          ? item.email
                          : field === "mobileno"
                          ? item.mobileno
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
              {add ? "Add" : "Edit"} Student
            </div>
    <form onSubmit={handleSubmit}>
    <div className="flex flex-col">
    <div className="flex  flex-wrap">
    <div className="flex flex-col gap-2 w-[49%]">
    <label htmlFor="name">Name*</label>
                    <input
                      type="text"
                      name="name"
                      maxLength={50}
                      placeholder={`Enter Student name...`}
                      onChange={handleFormChange}
                      value={modalData.name || ""}
                      className="form-control w-full"
                    />
         
           
           
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              name="email"
              maxLength={50}
              placeholder={"Enter email..."}
              onChange={handleFormChange}
              value={modalData.email || ""}
              className="form-control w-full"
             
            />
          
          </div>

          {/* Mobile */}
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="mobile">Mobile*</label>
            <input
              type="number"
              name="mobileno"
              maxLength={10}
              placeholder={"Enter mobile no..."}
              onChange={handleFormChange}
              value={modalData.mobileno || ""}
              className="form-control w-full"
              
            />
          
          </div>

          {/* Branch */}
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="branchId">Branch*</label>
            <select
             
              name="branchId"
              onChange={handleFormChange}

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
        </div>
    </form>
    </div>
    </div>
  )}

</div>)
};

export default StudentRegister;