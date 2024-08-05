"use client"
import Image from "next/image";
import {useState, useEffect} from "react"
import {firestore} from "@/firebase";
import {
    Box,
    Typography,
    Modal,
    Stack,
    TextField,
    Button,
    Grid,
    CardContent,
    CardMedia,
    Card,
    CircularProgress
} from "@mui/material";
import {query, collection, getDocs, doc, getDoc, deleteDoc, setDoc} from "firebase/firestore";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import "dotenv/config.js";

export default function Home() {
    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [recipeQuery, setRecipeQuery] = useState([]);

    const [loading, setLoading] = useState(false);


    const generateRecipes = async () => {
        setLoading(true);
        setRecipes([]);
        const response = await fetch
        (`https://api.spoonacular.com/recipes/findByIngredients?apiKey=cdd84cf637e042cba198a7e9364fce2b&ingredients=${recipeQuery.toString()}&addRecipeInstructions=true&instructionsRequired=true`);

        try {
            const recipe = await response.json();
            setRecipes(recipe);
        }catch(e) {
            console.log(e);
        }

        console.log(recipes);
        setLoading(false);
    }

    const removeItem = async (item) => {
        const docRef = doc(collection(firestore, "inventory"), item);
        const docs = await getDoc(docRef);

        if(docs.exists()){
            const {quantity} = docs.data();
            if(quantity === 1){
                await deleteDoc(docRef);
            }else{
                await setDoc(docRef, {quantity: quantity-1});
            }
        }

        updateInventory();
    }

    const addItem = async (item) => {
        const docRef = doc(collection(firestore, "inventory"), item);
        const docs = await getDoc(docRef);

        if(docs.exists()) {
            const {quantity} = docs.data();
            await setDoc(docRef, {quantity: quantity + 1});
        }else {
            await setDoc(docRef, {quantity: 1});
        }

        updateInventory();

    }


    const updateInventory = async () => {
        setLoading(true);
        const snapshot = query(collection(firestore, "inventory"));
        const docs = await getDocs(snapshot);
        const inventoryList = [];
        const list = []

        docs.forEach((doc) => {
            inventoryList.push({
                name: doc.id,
                ...doc.data()
            })
            list.push(doc.id);
        });

        setRecipeQuery(list);
        setInventory(inventoryList);

        setLoading(false);
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {updateInventory()}, []);

    return (
        <>
        <Box
            width = "100vw"
            height = "100vh"
            flexDirection = "column"
            gap = {2}
            bgcolor = "#f0f0f5">
            <Modal open = {open} onClose = {handleClose}>
               <Box position = "absolute"
                    top = "40%"
                    left = "40%"
                    transform = "translate(-50%, -50%)"
                    bgcolor = "white"
                    border = "1px"
                    borderRadius = "10px"
                    boxShadow = {15}
                    p = {4}
                    display = "flex"
                    flexDirection = "column"
                    gap = {3}>
                   <Typography variant = "h6"> Add item </Typography>
                   <Stack width = "100%" direction = "row" spacing = {1}>
                       <TextField variant = "outlined" value = {item} fullwidth onChange = {(e) => setItem(e.target.value)}> </TextField>
                       <Button variant = "outlined" onClick = {() => {
                           addItem(item)
                           setItem("")
                           setOpen(false)
                       }}> Add </Button>
                   </Stack>
               </Box>
            </Modal>
            { loading &&
                <Box display = "flex" justifyContent="center" alignItems = "center" position = "absolute" bgcolor = "#737373" height = "100vh" width = "100vw" style = {{"opacity" : ".5"}}>
                    <CircularProgress color="inherit"/>
                </Box>
            }

        <Box height = "88%">
            <Box width = "100%" display = "flex" justifyContent = "space-between" paddingX = {5} paddingY = {2} bgcolor = "white">
                <Typography variant = "h4">
                    Pantry Items
                </Typography>
                <Stack direction = "row" spacing = {1}>
                    <Button variant = "contained" display = "flex" justifyContent = "center" onClick = {() => handleOpen(true)} startIcon = {<AddIcon />}> Add Item </Button>
                    <Button variant = "contained" display = "flex" justifyContent = "center" onClick = {() => generateRecipes()}> Generate Recipes </Button>
                </Stack>
            </Box>
            <Stack direction = "row" height = "100%">
                <Stack width = "40%" height = "100%" spacing = {2} overflow = "auto" bgcolor = "#e0e0eb" m = {1} border = "1px" borderRadius = "10px">
                    {
                        inventory.map(({name, quantity}) =>
                            <Box key = {name}
                                 width = "100%"
                                 display = "flex"
                                 justifyContent = "space-between"
                                 alignItems = "center"
                                 pt = {2} pb = {0}>
                                <Grid container rowSpacing = {2}>
                                    <Grid item xs = {4} display = "flex" justifyContent="center"> <Typography variant = "h6"> {name.charAt(0).toUpperCase() + name.slice(1)} </Typography> </Grid>
                                    <Grid item xs = {4} display = "flex" justifyContent="center"> <Typography variant = "h6"> {quantity} </Typography> </Grid>
                                    <Grid item xs = {4} display = "flex" justifyContent="center"> <Button variant = "contained" onClick = {() => removeItem(name)} startIcon = {<DeleteIcon />}> Delete </Button> </Grid>
                                </Grid>
                            </Box>
                        )
                    }
                </Stack>
                <Box width = "80%" height = "100%" overflow = "auto" my = {2} me = {2}>
                    <Grid container spacing = {2} direction = "row">
                        {
                            recipes.map((item, index) =>
                                <Grid item xs = {4} key = {item.title}>
                                    <Card sx={{ minWidth: 250 }}>
                                        <CardMedia
                                            sx={{ height: 140 }}
                                            image={item.image}
                                            title={item.title}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="p" component="div">
                                                {item.title}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        }
                    </Grid>
                </Box>
            </Stack>
        </Box>
        </Box>
        </>
    );
}
