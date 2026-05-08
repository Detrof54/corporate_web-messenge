export function DateFromFormate (date: Date){
  const dateObject = new Date(date);

  if (isNaN(dateObject.getTime())) {
    return 'Неизвестная дата';
  } 
  else {
    const dateCreateUser = date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return dateCreateUser
  }
}