db.users.insertMany([{
	_id: ObjectId(1),
	email: "ilia@google.com",
	password: "$2a$12$sEj8G6QXp6XVTDwVuk.IQeIN2cI8xI85Wts8vJMMkNYMQBs0WkgLe", // pwd
	rights: ["canView", "canEdit"],
	__v: 0,
}]);
db.forms.insertMany([{
	_id: ObjectId(2),
	email: "abc@test.com",
	name: "Test test",
	phone: "+7 (921) 122-22-21",
	birthDate: new Date("05.05.1949"),
	additionalInfo: "",
	social: "https://vk.com/id333",
	job: "dscfs",
	position: "sdfsd",
	goal: "sdfsd",
	__v: 0,
}]);
