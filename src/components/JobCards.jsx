import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filters, companyName } from "../redux_store/slices/jobsApiSlice";
import {
  fetchJobs,
  selectHasMore,
  selectJobs,
  selectLoading,
  selectIsInitialCall,
  selectOffset,
  changeOffset,
} from "../redux_store/slices/infiniteScrollerSlice";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Typography,
  Link,
  Avatar,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import Profile1 from "../assets/profile.webp";
import Profile2 from "../assets/profile2.webp";
import JobDialougeBox from "./JobDialougeBox";

const JobCards = () => {
  const companyNameStyle = {
    fontSize: "15px",
    fontWeight: 600,
    letterSpacing: "1px",
    color: "#8b8b8b",
  };

  const jobRoleStyle = {
    fontSize: "20px",
    letterSpacing: "1px",
  };

  const jobLocationStyle = {
    fontSize: "13px",
    letterSpacing: "1px",
    marginBottom: "3px",
  };

  const salaryStyle = {
    fontSize: "15px",
    padding: "0 20px",
    display: "flex",
    gap: "6px",
    alignItem: "center",
    color: "#89919b",
  };

  const referralImages = [
    {
      name: "referal person 1",
      img: Profile1,
    },
    {
      name: "referal person 2",
      img: Profile2,
    },
  ];

  const dispatch = useDispatch();

  const fetchedJobs = useSelector(selectJobs);
  const isLoading = useSelector(selectLoading);
  const offset = useSelector(selectOffset);
  const isInitialCall = useSelector(selectIsInitialCall);
  const hasMore = useSelector(selectHasMore);
  const selectedfilters = useSelector(filters);
  const selectedCompany = useSelector(companyName);

  const loadingRef = useRef(null);

  const [loadedJobs, setLoadedJobs] = useState({});
  const [filteredJobs, setFilteredJobs] = useState([]);
  const handleImageLoad = (index) => {
    setLoadedJobs((prev) => ({ ...prev, [index]: true }));
  };
  console.log({ offset });
  useEffect(() => {
    console.log("called1");
    if (hasMore) {
      dispatch(fetchJobs({ offset: offset, limit: 10 }));
    }
  }, [hasMore, offset, dispatch]);

  useEffect(() => {
    console.log("called2");
    console.log({ offset });
    if (!loadingRef.current) return;

    const loading = loadingRef.current;
    const loadingObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInitialCall) {
          dispatch(changeOffset());
        }
      },
      {
        threshold: 1,
      }
    );

    loadingObserver.observe(loading);
    return () => {
      if (loading) loadingObserver.unobserve(loading);
    };
  }, [fetchedJobs]);

  console.log({ hasMore });

  const handleSalaryNull = (minSalary, maxSalary) => {
    if (minSalary === null && maxSalary === null) {
      return "Not Specified";
    } else if (minSalary === null) {
      return `₹${maxSalary} LPA`;
    } else if (maxSalary === null) {
      return `₹${minSalary} LPA`;
    } else {
      return `₹${minSalary} - ${maxSalary} LPA`;
    }
  };

  // Convert selectedfilters.location to lowercase
  const lowerCaseLocation =
    selectedfilters.location &&
    selectedfilters.location.map((location) => location.toLowerCase());
  const lowerCaseRole =
    selectedfilters.role &&
    selectedfilters.role.map((role) => role.toLowerCase());

  const min_base_salary =
    selectedfilters.min_base_salary &&
    parseInt(selectedfilters.min_base_salary.slice(0, -1));

  // Create a new object to store the converted filters
  const filtersLowerCase = {
    ...selectedfilters,
    location: lowerCaseLocation,
    role: lowerCaseRole,
    min_base_salary: min_base_salary,
  };

console.log({selectedfilters}, {selectedCompany});

  useEffect(() => {
    // Filter the fetchedJobs based on selected filters
    const filteredData =
      !isLoading &&
      fetchedJobs &&
      fetchedJobs.filter((job) => {
        if (Object.keys(selectedfilters).length > 0) {
          if (
            filtersLowerCase.min_experience !== null &&
            job.minExp < parseInt(selectedfilters.min_experience)
          ) {
            return false;
          }

          if (
            filtersLowerCase.role &&
            filtersLowerCase.role.length > 0 &&
            !filtersLowerCase.role.includes(job.jobRole)
          ) {
            return false;
          }

          if (
            filtersLowerCase.location &&
            filtersLowerCase.location.length > 0 &&
            !filtersLowerCase.location.includes(job.location)
          ) {
            return false;
          }

          if (
            filtersLowerCase.min_base_salary &&
            filtersLowerCase.min_base_salary !== null &&
            job.minJdSalary < filtersLowerCase.min_base_salary
          ) {
            return false;
          }

          return true; // Return true for jobs that pass all filters
        } 

        // Filter the fetchedJobs based on selected company
         if (
           !job.companyName
             .toLowerCase()
             .includes(selectedCompany.toLowerCase())
         ) {
           return false;
         }

        return true;
      });
    setFilteredJobs(filteredData);
  }, [fetchedJobs, selectedfilters, selectedCompany]);


  console.log({ fetchedJobs });

  return (
    <Box>
      <Grid container columnSpacing={10} rowSpacing={5}>
        {filteredJobs &&
          filteredJobs.map((job, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              key={index}
              sx={loadedJobs[index] ? { opacity: 1 } : { opacity: 0 }}
              onLoad={() => handleImageLoad(index)}
            >
              <Card
                className="card-animation"
                elevation={3}
                sx={{
                  borderRadius: "1.5rem",
                  p: { sm: "0.5rem", xl: "1rem 2rem" },
                  pb: { xs: "1rem", sm: "auto" },
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Box style={{ display: "flex", padding: "20px", gap: "10px" }}>
                  <img
                    style={{ width: "35px", height: "35px" }}
                    src={job.logoUrl}
                    alt={`${job.companyName} logo`}
                  />
                  <Box>
                    <Typography style={companyNameStyle} variant="h6">
                      {job.companyName}
                    </Typography>
                    <Typography
                      className="job-role"
                      style={jobRoleStyle}
                      variant="h6"
                    >
                      {job.jobRole}
                    </Typography>
                    <Typography
                      style={jobLocationStyle}
                      className="job-location"
                      variant="h6"
                    >
                      {job.location}
                    </Typography>
                  </Box>
                </Box>
                <Typography style={salaryStyle}>
                  Estimated Salary:{" "}
                  {handleSalaryNull(job.minJdSalary, job.maxJdSalary)}
                  <CheckBoxIcon color="success" />
                </Typography>
                <CardContent
                  sx={{
                    maxHeight: "250px",
                    height: "100%",
                    overflow: "hidden",
                    maskImage:
                      "linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255), rgba(255, 255, 255, 0))",
                  }}
                >
                  <Typography
                    style={{ fontWeight: 500, fontSize: "20px" }}
                    varinat="h6"
                  >
                    About Company:
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 300, fontSize: "15px" }}
                    varinat="body1"
                  >
                    {job.jobDetailsFromCompany}
                  </Typography>
                </CardContent>
                <JobDialougeBox
                  jobDescription={job.jobDetailsFromCompany}
                  jdLink={job.jdLink}
                />
                <CardActions
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    alignItems: "start",
                    marginLeft: "0",
                    padding: "0 18px",
                  }}
                >
                  <Box sx={{ margin: "15px 0" }}>
                    <Typography
                      sx={{
                        textAlign: "start",
                        color: "#8b8b8b",
                        fontSize: "15px",
                        fontWeight: 500,
                        letterSpacing: "1px",
                      }}
                    >
                      Minimum Experience: <br />
                      <span style={{ color: "black" }}>
                        {job.minExp === null
                          ? "Not Specified"
                          : `${job.minExp} years`}
                      </span>
                    </Typography>
                  </Box>
                  <Link
                    href={job.jdLink}
                    target="_blank"
                    underline="none"
                    sx={{ width: "100%" }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        display: "flex",
                        gap: "10px",
                        backgroundColor: "#55EFC4",
                        color: "black",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#55EFC4",
                        },
                        py: "0.75rem",
                      }}
                    >
                      <ElectricBoltIcon style={{ color: "yellow" }} /> Easy
                      Apply
                    </Button>
                  </Link>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      marginLeft: "0",
                      textTransform: "none",
                      gap: "10px",
                      py: "0.75rem",
                    }}
                  >
                    {referralImages.map((referralImage, index) => (
                      <Avatar
                        sx={{
                          width: "30px",
                          height: "30px",
                          filter: "blur(1.3px)",
                        }}
                        key={index}
                        alt={referralImage.name}
                        src={referralImage.img}
                      />
                    ))}
                    Unlock referal asks
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
      {hasMore && (
        <div ref={loadingRef}>
          <div className="loader">
            <h1 className="spin"> Loading....</h1>
          </div>
        </div>
      )}
    </Box>
  );
};

export default JobCards;
