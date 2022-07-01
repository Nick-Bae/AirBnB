customers hasMany reservations

reservations belongsTo customers
             belongsTo rooms
             hasOne reviews

rooms hasMany reservations
      belongsTo hosts
      hasMany reviews

host hasMany rooms

reviews belongsTo reservations
        belongsTo rooms

