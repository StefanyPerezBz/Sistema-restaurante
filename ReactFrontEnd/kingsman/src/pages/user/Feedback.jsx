// import React, { useState } from 'react';
// import { Textarea } from "flowbite-react";
// import { Button } from "flowbite-react";
// import { Rating } from '@mui/material';
// import Typography from '@mui/material/Typography';

// export default function Feedback() {
//   const [value, setValue] = useState(3); // Placeholder value (3)

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <form className="w-100 h-100 bg-slate-300 border-black p-5 rounded-lg">
//         <div className="mb-8 flex justify-between">
//           <h1 className="text-xl font-bold">Kingsman</h1>
//           <h1 className="text-xl font-bold">Your Feedback</h1>
//         </div>
//         <hr />

//         <div className="mb-7">
//           <p className="text-lg mb-2">We would like your feedback to improve our service</p>
//           <div className="mb-2 flex justify-center items-center">
//             <Typography component="legend">Rate our Foods</Typography>
//           </div>
//           <div className="flex justify-center items-center">
//             <Rating 
//               name="foods-rating"
//               value={value}
//               precision={0.5} // Allow half-star increments
//               sx={{ fontSize: '32px' }} // Increase the size of stars
//               onChange={(event, newValue) => {
//                 setValue(newValue);
//               }}
//             />
//           </div>
//         </div>
//         <hr />

//         <div className="mb-4">
//           <div className="mb-2 block">
//             <label htmlFor="comment" className="text-lg">Your Feedback</label>
//           </div>
//           <Textarea id="comment" placeholder="Leave a opinion..." required rows={7} />
//         </div>
         
//         <div className="mb-4  flex justify-end mr-4">
//           <Button color="blue" pill>Submit Feedback</Button>
//         </div>
//       </form>
//     </div>
//   );
// }

import React from 'react'

function Feedback() {
  return (
    <div class="grid grid-cols-2 divide-x">

    </div>
  )
}

export default Feedback