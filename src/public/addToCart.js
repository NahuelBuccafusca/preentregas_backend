async function addToCart(pid) {
    const cid = '66563df8b6bb68667f581300';
    const url = `http://localhost:8080/api/carts/post/${cid}/product/${pid}`;

    try {
        const response = await fetch(url, {
            method: 'POST'
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Producto agregado al carrito:', data);
            alert('Producto agregado al carrito con éxito');
        } else {
            throw new Error('Error al agregar el producto al carrito');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al agregar el producto al carrito');
    }
}