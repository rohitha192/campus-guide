const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// --- THIS IS YOUR COMPLETE KNOWLEDGE BASE ---
// I have added the new details you requested.
const knowledgeBase = {
  // --- NEW DETAILS ADDED HERE ---
  'chairman': "The founder and chairman of Vignan's Group of Institutions is Dr. Lavu Rathaiah.",
  'CEO': "The CEO of Vignan's University is Dr.Meghana",
  'vice chairman':"The vice chairman of Vignan's university is son of Dr.Lavu Ratiah i.e Dr.Sri Krishna Devarayalu", 
  'vice chancellor': 'The Vice-Chancellor oversees the academic and administrative operations of the university.',
  'accreditation': "Vignan's Foundation for Science, Technology & Research is accredited by NAAC with an 'A+' Grade.",
  'location': 'Vignan University is located in Vadlamudi, Guntur District, Andhra Pradesh, India.',
  // --- EXISTING DETAILS ---
  'library timings': 'The library is open from 8:00 AM to 8:00 PM on weekdays, and 9:00 AM to 5:00 PM on weekends.',
  'canteen timings': 'The main canteen operates from 8:30 AM to 6:30 PM daily.',
  'transport': 'The university provides bus service covering routes in Guntur, Tenali, and Vijayawada.',
  'hostel facilities': 'Hostels are equipped with Wi-Fi, laundry services, dedicated study rooms, and 24x7 security.',
  'departments': 'Key departments include CSE, ECE, Mechanical, Civil, IT, Biotechnology, Agriculture, and Management.',
  'attendance policy': 'A minimum of 75% attendance is required to be eligible to attend the semester-end examinations.',
  'placement': 'Top recruiters visiting our campus include TCS, Infosys, Wipro, Accenture, and Amazon.',
  'canteen menu': 'The canteen offers a variety of South Indian meals, snacks, beverages, and fast food options.',
  'sports': 'Our campus has facilities for cricket, football, badminton, table tennis, a gymnasium, and athletics.',
  'vignan mahotsav': 'Vignan Mahotsav is our annual national-level technical, cultural, and sports fest.',
  'erp login': 'You can access the ERP portal via erp.vignan.ac.in using your student credentials.',
  'library membership': 'All students receive automatic library membership. Your student ID card is required for borrowing books.',
  'research centers': 'We have dedicated research centers for AI, Renewable Energy, Biotechnology, and Robotics.',
  'principal': 'The principal is the head of the institution and oversees all academic, administrative, and student affairs.',
  'academic calendar': 'The academic calendar, which includes two semesters per year, is available on vignan.ac.in/calendar.',
  'bus timings': 'Morning bus pickups start around 7:00 AM, with the evening return trip starting at 5:00 PM.',
  'clubs': 'We have many student clubs, including a Coding Club, Robotics Club, Cultural Club, Literary Club, NSS, and a Sports Club.',
  'scholarships': 'The university offers merit-based, sports-based, and need-based scholarships each year. Please check the admin block for details.',
  'placements 2024': 'In 2024, over 1000 students were placed, with the top package offered being ₹12 LPA.',
  'faculty': 'Our faculty consists of highly qualified professors with extensive research and industry experience.',
  'dress code': 'A formal dress code is to be followed during class hours. Lab coats are mandatory in all laboratories.',
  'fest dates': 'Vignan Mahotsav is usually held in the month of February each year. Exact dates are announced on the college website.',
  'library books': 'Our library houses over 80,000 books and subscribes to more than 500 journals across all disciplines.',
  'hostel mess': 'The hostel mess serves nutritious vegetarian and non-vegetarian meals according to a fixed schedule.',
  'fees payment': 'You can pay your fees online through the ERP portal or directly at the accounts section on campus.',
  'admissions': 'Admissions are conducted through VSAT, AP EAPCET, JEE Main, or the Management quota.',
  'placement training': 'The university provides dedicated training in soft skills, aptitude, coding, and mock interviews for placements.',
  'transport office': 'The transport office is located near the administrative block. You can visit for route information and bus pass details.',
  'sports timings': 'Sports facilities are generally open in the morning from 6:00 AM to 8:00 AM and in the evening from 4:00 PM to 7:00 PM.',
  'medical facility': 'A 24x7 clinic is available on campus with an ambulance service and resident medical staff for any emergencies.',
  'wifi': 'The entire campus is Wi-Fi enabled. Students can log in using their secure credentials.',
  'examination cell': 'The examination cell, located in H-Block, handles all exam schedules, results, and revaluation requests.',
  'student portal': 'The student portal is available at student.vignan.ac.in. You can check your results, attendance, and other important notices there.',
  'placements companies': 'Top companies that recruit from our campus include Infosys, Deloitte, Cognizant, Capgemini, and IBM.',
  'cafeteria': 'Besides the main canteen, there are multiple smaller cafeterias across the campus offering snacks, juices, and beverages.',
  'cultural fest': 'Vignanotsav is our grand cultural extravaganza featuring music, dance, and literary events.',
  'sports week': 'An annual sports meet is held every year, featuring tournaments between different departments.',
  'parking': 'Separate and secure parking areas are available for students, staff, and visitors near the main gate.',
  'security': 'The campus has round-the-clock security with personnel at all key locations and CCTV surveillance.',
  'water facility': 'RO purified drinking water is available in coolers placed in all academic blocks and hostels.',
  'alumni association': 'We have an active alumni network that organizes an annual meet and provides mentoring programs for current students.',
  'innovation cell': 'The innovation cell actively promotes student startups and innovative projects through mentoring and seed funding.',
  'placement office': 'The placement office is located in A-block. Students can register for upcoming placement drives there.',
  'library fine': 'A fine of ₹5 per day is charged for overdue books that are not returned by the due date.',
  'nss': 'The National Service Scheme (NSS) unit at Vignan conducts social service, environmental, and awareness activities throughout the year.',
  'coding club': 'The coding club organizes weekly coding sessions, workshops, and hackathons to improve students\' programming skills.',
  'robotics club': 'The robotics club provides hands-on workshops and projects in the fields of robotics and IoT.',
  'department fest': 'Each academic department hosts its own annual technical and cultural fest to showcase student talent.'
};

// This function finds the best answer from our knowledge base
function getVignanResponse(query) {
    const lowerQuery = query.toLowerCase();

    // Find the best keyword match in the user's question
    let bestMatch = null;
    let highestScore = 0;

    for (const keyword in knowledgeBase) {
        if (lowerQuery.includes(keyword)) {
            // A simple scoring system: the longest keyword that matches is considered the best.
            if (keyword.length > highestScore) {
                highestScore = keyword.length;
                bestMatch = keyword;
            }
        }
    }

    if (bestMatch) {
        return knowledgeBase[bestMatch];
    }

    // This is the default response if no relevant keyword is found in the user's question.
    return "I can only answer questions about Vignan University. Please ask me about topics like library timings, fests, or admissions.";
}

// The API endpoint that your frontend calls
router.post('/ask', auth, async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'A query is required.' });
    }

    try {
        // We now call our local, reliable function
        const responseText = getVignanResponse(query);
        res.json({ response: responseText });
    } catch (error) {
        console.error('Error in /ask route:', error);
        res.status(500).json({ error: 'Server error while processing your question.' });
    }
});

module.exports = router;

