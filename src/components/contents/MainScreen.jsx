// 09/05/2024 
import { ReactComponent as LogoExit } from '../assets/componentsMain/exitLogo.svg'
import { ReactComponent as LogoBar } from '../assets/componentsMain/barCategory.svg'
import { ReactComponent as IconUndoCheck } from '../assets/componentsMain/listundocheckicon.svg'
import { ReactComponent as IconCheck } from '../assets/componentsMain/listcheckicon.svg'
import { ReactComponent as IconAddList } from '../assets/componentsMain/iconAddList.svg'
import { ReactComponent as IconEveraseEverything } from '../assets/componentsMain/iconEveraseEverything.svg'
import './style/mainScreen.css'

import auth from '../../db'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { useNavigate} from 'react-router-dom'
import { getDatabase, ref, push, onValue, remove, update} from 'firebase/database'
import { useEffect, useState } from 'react'

const Main = () => {
    const navigate = useNavigate();
    const [handleModal, setHandleModal] = useState(false);
    const [handleModalDeleteList, setHandleModalDeleteList]= useState(false)
    const [handleBtnCategoryFood, setHandleBtnCategoryfood] = useState(true);
    const [inputProductName, setInputProductName] = useState('');
    const [inputProductAmount, setInputProductAmount] = useState('');
    const [list, setList] = useState(null);
    
    const [total, setTotal]= useState(0)
    
    // signout
    const handleSignOut = () => {
        signOut(auth)
            .then(() => navigate('/'))
            .catch((error) => console.log(error.message));
    };

    const handleCategoryFood = () => {
        setHandleBtnCategoryfood(true);
    };

    const handleCategoryHygiene = () => {
        setHandleBtnCategoryfood(false);
    };

    const clearInputs = () => {
        setInputProductName('');
        setInputProductAmount('');
    };


    // register product
    const registerProduct = () => {
        let productAmount = parseInt(inputProductAmount);
        let productCategory = handleBtnCategoryFood ? 'food' : 'hygiene';
        let productIsCheck = false
        let productPrice = 0

        const auth = getAuth();
        const user = auth.currentUser;
        const userId = user.uid;

        const database = getDatabase();
        const productReference = ref(database, 'user/' + userId + '/products');

        productAmount = isNaN(productAmount) || productAmount < 1 ? 1 : productAmount;

        push(productReference, {
            prodName: inputProductName,
            prodAmount: productAmount,
            prodCategory: productCategory,
            prodPrice: productPrice,
            prodIsCheck: productIsCheck
        })
        .then(() => {
            clearInputs();
        })
        .catch((error) => {
            console.log(error.message);
        });
    };

    // delete list
    const deleteList = (key) => {
        let database = getDatabase();
        let userId = auth.currentUser.uid;
        let reference = ref(database, `user/${userId}/products/${key}`);

        remove(reference)
        .then(() => {})
        .catch((error) => console.log(error.message));
    };

    // delete all list 
    const deleteAllList = ()=>{
        let database = getDatabase()
        let userId = auth.currentUser.uid
        let reference = ref(database, `user/${userId}/products/` )
        remove(reference)
        .then(()=>{
            setHandleModalDeleteList(false)
        })
        .catch((error)=>{
            console.log(error.message)
        })
    }



    // update product
    const updateProduct = (value, key, inputFor) => {
        let database = getDatabase();
        let userId = auth.currentUser.uid;
        let reference = ref(database, `user/${userId}/products/${key}`);

        const updateData = inputFor === 'amount' ? { prodAmount: value } : { prodPrice: value };

        update(reference, updateData)
        .then(() =>{})
        .catch((error) => console.log(error.message));
    };

    // update is check
    const updateIsCheck = (key, currentIsCheck) => {
        
        let database = getDatabase();
        let userId = auth.currentUser.uid;
        let reference = ref(database, `user/${userId}/products/${key}`);

       
        update(reference, {
            prodIsCheck: currentIsCheck
        })
        .then()
        .catch((error) => console.log(error.message));
    }

    // authentication user 
    useEffect(() => {
        const checkAuthentication = () => {
            onAuthStateChanged(auth, (user) => {
                if (!user) {
                    navigate('/');
                }
            });
        };

        checkAuthentication();
    }, [navigate]);

    // get list
    useEffect(() => {
        const getList = () => {
            const database = getDatabase();
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const userId = user.uid;
                const listReference = ref(database, 'user/' + userId + '/products');

                onValue(listReference, (snapshot) => {
                    const data = snapshot.val();
                    setList(data);
                    
                });
            } else {
                navigate('/');
            }
        };

        getList();
    }, [navigate]);


    useEffect(() => {
        const calTotal = () => {
            let totalSum = 0;
    
            if (list) {
                Object.values(list).forEach((item) => {
                    let amount = parseInt(item.prodAmount);
                    let price = parseFloat(item.prodPrice);
                    if (!isNaN(amount) && !isNaN(price)) {
                        totalSum += amount * price;
                    }
                });
            }
            return totalSum.toLocaleString('pt-BR', {minimumFractionDigits:2});
        };
    
        setTotal(calTotal());
    }, [list]);


 
    return (
        <div className="mainContainer" >
            <div className="header">
                <div className="buttonSignOut" onClick={handleSignOut}>
                    <LogoExit className='exit-logo' />
                    <p className='exit-legend'>Sair</p>
                </div>
                <div className="titleApp">
                    <p>Lista</p>
                </div>
            </div>

            <div className="main">
                <div className="column-legend">
                    <p>Produto</p>
                    <p>Quantidade</p>
                    <p>Preço</p>
                </div>

                <div className="list-food">
                    <div className="category-title">
                        <div className="legend-category">
                            <p>Alimento</p>
                        </div>
                        <div className="bar">
                            <LogoBar />
                        </div>
                    </div>

                    <div className="list-content">
                        {list && Object.entries(list)
                        .sort(([, a],[,b]) => a.prodName.localeCompare(b.prodName))
                        .map(([key, item]) => {

                            if (item.prodCategory === 'food') {
                                return (
                                    <div className={item.prodIsCheck ? "list list-check" : "list list-undoCheck"} key={`food_${key}`}>
                                        <div className="list-name">
                                            <p>{item.prodName}</p>
                                        </div>
                                        <div className="list-amount">
                                            <input
                                                type="number"
                                                min={1}
                                                className='input-list-amount'
                                                value={item.prodAmount ? item.prodAmount : ''}
                                                onChange={(e) => updateProduct(e.target.value, key, 'amount')}
                                            />
                                            <p>x</p>
                                        </div>
                                        <div className="list-price">
                                            <p>R$</p>
                                            <input
                                                type="number"
                                                min={0}
                                                max={22}
                                                className='input-list-amount'
                                                value={item.prodPrice}
                                                onChange={(e) => 
                                                    updateProduct(e.target.value, key, 'price')
                                                    
                                                }
                                            />
                                        </div>
                                        <div className="list-buttons-list">
                                            {!item.prodIsCheck ?
                                                <div className="button-check" onClick={() => { 
                                                    let value = item.prodIsCheck
                                                    updateIsCheck(key, !value) }}>
                                                    <IconCheck />
                                                </div> :
                                                <div className="button-undoCheck" onClick={() => {
                                                    let value = item.prodIsCheck 
                                                    updateIsCheck(key, !value)}}>
                                                    <IconUndoCheck />
                                                </div>}
                                            <div className="button-delete-list" onClick={() => deleteList(key)}>
                                                <p>Excluir</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return null
                        })}
                    </div>
                </div>

                <div className="list-hygiene">
                    <div className="category-title">
                        <div className="legend-category">
                            <p>Higiene</p>
                        </div>
                        <div className="bar">
                            <LogoBar />
                        </div>
                    </div>
                    <div className="list-content">
                        {list && Object.entries(list)
                        .sort(([, a],[, b])=> a.prodName.localeCompare(b.prodName))
                        .map(([key, item]) => {
                            if (item.prodCategory === 'hygiene') {
                                return (
                                    <div className={item.prodIsCheck ? "list list-check" : "list list-undoCheck"} key={`food_${key}`}>
                                        <div className="list-name">
                                            <p>{item.prodName}</p>
                                        </div>
                                        <div className="list-amount">
                                            <input
                                                type="number"
                                                min={1}
                                                className='input-list-amount'
                                                value={item.prodAmount ? item.prodAmount : 1}
                                                onChange={(e) => updateProduct(e.target.value, key, 'amount')}
                                            />
                                            <p>x</p>
                                        </div>
                                        <div className="list-price">
                                            <p>R$</p>
                                            <input
                                                type="number"
                                                min={0}
                                                className='input-list-amount'
                                                value={item.prodPrice}
                                                onChange={(e) => updateProduct(e.target.value, key, 'price')}
                                            />
                                        </div>
                                        <div className="list-buttons-list">
                                            {!item.prodIsCheck ?
                                                <div className="button-check" onClick={() => { 
                                                    let value = item.prodIsCheck
                                                    updateIsCheck(key, !value) }}>
                                                    <IconCheck />
                                                </div> :
                                                <div className="button-undoCheck" onClick={() => {
                                                    let value = item.prodIsCheck 
                                                    updateIsCheck(key, !value)}}>
                                                    <IconUndoCheck />
                                                </div>}
                                            <div className="button-delete-list" onClick={() => deleteList(key)}>
                                                <p>Excluir</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return null;
                        })}
                    </div>
                </div>

                <div className="erase-everything-content" onClick={()=>{setHandleModalDeleteList(true)}}>
                    <div className="btn-erase-everything" >
                        <IconEveraseEverything />
                        <p>Apagar tudo</p>
                    </div>
                </div>

                {
                    
                handleModal &&
                    
                    <div className="modal">
                        <form className="form-list-content">
                            <p className="title-form-list">Adicionar</p>
                            <div className="form-list">
                                <div className="category-list">
                                    <button type='button' className={`btn-food ${handleBtnCategoryFood ? 'category-btn-active' : ''}`} onClick={handleCategoryFood}>Alimento</button>
                                    <button type='button' className={`btn-hygiene ${handleBtnCategoryFood ? '' : 'category-btn-active'}`} onClick={handleCategoryHygiene}>Higiene</button>
                                </div>
                                <div className="inputs-list">
                                    <div className="input-name-list">
                                        <label htmlFor="input-list-name">Nome</label>
                                        <input
                                            type="text"
                                            name="input-list-name"
                                            id="input-list-name"
                                            value={inputProductName}
                                            onChange={(e) => setInputProductName(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-amount-list">
                                        <label htmlFor="input-list-amount">Quantidade</label>
                                        <input
                                            type="number"
                                            name="input-list-amount"
                                            id="input-list-amount"
                                            value={inputProductAmount}
                                            onChange={(e) => setInputProductAmount(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="btns-form-list">
                                    <button type='button' id='btn-form-salve' onClick={registerProduct}>Salvar</button>
                                    <button id='btn-form-cancel' onClick={() => setHandleModal(false)}>Fechar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                }                
                {
                // modal delete list
                <div className={handleModalDeleteList?'modal-delete-list modal-delete-list-active':'modal-delete-list'}>
                    <p id="title-delete-list">Tem certeza que quer apagar tudo?</p>
                        <div id="btn-delete-content">
                            <button type='button' id='btn-delete-list' onClick={(()=>deleteAllList())}>Sim</button>
                            <button type='button' id='btn-delete-cancel' onClick={() => setHandleModalDeleteList(false)}>Cancelar</button>
                        </div>
                    </div>
                }
            </div>

            <div className="footer">
                <div className="btn-add-content">
                    <div className="btn-add-list" onClick={() => setHandleModal(true)}>
                        <div className="icon-button-add-list">
                            <IconAddList />
                        </div>
                        <p>Adicionar</p>
                    </div>
                </div>
                <div className="total-content">
                    <div className="title-total">
                        <p>Total</p>
                    </div>
                    <div className="title-total-content">
                        <p className='legend-total'>R$</p>
                        <p className='legend-price'>{total}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
