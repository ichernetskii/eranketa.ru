export const mapData = {
    email: {
        label: "Email",
        type: "email",
        required: true
    },
    name: {
        label: "Фамилия, имя, отчество",
        type: "text",
        required: true
    },
    phone: {
        label: "Телефон",
        type: "tel",
        required: true
    },
    birthDate: {
        label: "Дата рождения",
        type: "date",
        required: true
    },
    social: {
        label: "Ссылка на профиль ВКонтакте",
        type: "url",
        required: "true"
    },
    job: {
        label: "Место работы или учёбы",
        type: "text",
        required: "true"
    },
    position: {
        label: "Должность или учебная специальность",
        type: "text",
        required: "true"
    },
    goal: {
        label: "Цель вступления в партию",
        type: "text",
        required: "true"
    },
    additionalInfo: {
        label: "Дополнительная информация",
        type: "textarea",
        required: false
    }
}
