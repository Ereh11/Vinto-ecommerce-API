### State

```javascript
const SUCCESS = "success";
const FAIL = "fail";
const ERROR = "error";
```

### User

```javascript
{ status: SUCCESS, code: 200, data: {
  id:string: "", userName:string: "", email:string: "", password:string: ""}};
{ status: FAIL, code: 400, data: { user: null } };
{ status: ERROR, code: 500, data: null, message: error.message};
```

### Profile

```javascript
{ status: SUCCESS, code: 200, data: {
  id:string: "",
  firstName:string: "",
  lastName:string: "",
  age:number: "",
  img:string: "",
  gender:string: ""
}};
{ status: FAIL, code:400, data: { profile: null } };
{ status: ERROR, code: 500, data: null, message: error.message};
```

### Category

```javascript
{ status: SUCCESS, code: 200, data: {
  id:string: title:string: "", img:string: ""}};
{ status: FAIL, code: 400, data: { category: null } };
{ status: ERROR, code: 500, data: null, message: error.message};
```

### Product

```javascript
{ status: SUCCESS, code: 200, data: {id:string: "", title:string: "",
  describe:string: "", discount:number: "", price:number: "", rate:number: "", img:string "", quantity:number: ""}};
{ status: FAIL, code: 400, data: { product: null } };
{ status: ERROR, code: 500, data: null, message: error.message};
```

### Wished

```javascript
{ status: SUCCESS, code: 200, data: {id:string: "", userId:string: "",
  productId:string: ""}};
{ status: FAIL, code: 400, data: { wished: null } };
{ status: ERROR, code: 500, data: null, message: error.message};
```

### Liked

```javascript
{ status: SUCCESS, code: 200, data: {id:string: "", userId:string: "",
  productId:string: ""}};
{ status: FAIL, code: 400, data: { liked: null } };
{ status: ERROR, code: 500, data: null, message: error.message};
```
