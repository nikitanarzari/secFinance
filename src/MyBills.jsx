 import {useState}  from "react";
 import { createWorker } from "tesseract.js";
 import "./MyBills.css";
 function MyBills(){
    const[bills, setbills]=useState([]);
    const[name,setname]=useState("");
    const[amount,setamount]=useState("");
    const[date,setdate]=useState("");
    const [scanning, setScanning] = useState(false);

 function addBill(){
    if(name===""|| amount===""||Number(amount)<=0){
        alert("Enter a Valid Name and Amount");
        return;
    }
    const newBill={
        id:Date.now(),
        name:name,
        amount:Number(amount),
        date:date||new Date().toLocaleDateString()
    };
    setbills([...bills, newBill]);
    setname("");
    setamount("");
    setdate("");
                   

 }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setScanning(true);
    try {
      const worker = await createWorker("eng");
      const ret = await worker.recognize(file);
      await worker.terminate();

      const extractedText = ret.data.text;
      console.log("Extracted OCR Text:", extractedText);

      
      const numbers = extractedText.match(/\d+(\.\d{1,2})?/g);
      let detectedAmount = numbers ? Number(numbers[numbers.length - 1]) : 100;
      let detectedName = file.name.split(".")[0] || "Scanned Bill";

      const scannedBill = {
        id: Date.now(),
        name: detectedName,
        amount: detectedAmount,
        date:new Date().toLocaleDateString()
      };

      setbills((prevBills) => [...prevBills, scannedBill]);
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Failed to read bill image. Try manual entry!");
    } finally {
      setScanning(false);
    }
  }
   function removeBill(idToDelete){
    let remaining=[];
    for(let i=0;i<bills.length;i++){
        if (bills[i].id !== idToDelete) {
        remaining.push(bills[i]);
         }
     }
   
   setbills(remaining);
   }
   let total=0;
   for(let i=0;i<bills.length;i++){
    total=total +bills[i].amount;
   }
    return(
      <div className="bill-box">

     <div>
           
            <h2>My Bill Tracker</h2>
         <input
               type="text"
              placeholder="Bill Name"
              value={name}
              onChange={(e)=>setname(e.target.value) }
            />
            <input
            type="number"
              placeholder="Amount"
             value={amount}
             onChange={(e)=>setamount(e.target.value)}
            />
            <input
            type="date"
            value={date}
            onChange={(e) => setdate(e.target.value)}
            />
               <button onClick={addBill}>Add Bill</button>

             <h3>or</h3>
               
        <label>Upload Bill Photo: </label>
       <input type="file" accept="image/*" onChange={handleImageUpload} />
        {scanning && <p>Scanning bill...</p>}
      



       <table>
        <thead>
              <tr>
               <th>Bill Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((b) => (
            <tr key={b.id}>
              <td>{b.name}</td>
                <td>{b.amount}</td>
                <td>{b.date}</td>
              <td>
                <button onClick={() => removeBill(b.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Total Amount: ₹{total}</h4>
        </div>
        </div>
    );
 }
 export default MyBills;