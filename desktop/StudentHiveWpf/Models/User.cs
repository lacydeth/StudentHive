﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentHiveWpf.Models
{
    public class User
    {
        public int Id { get; set; }
        public int? OrganizationId { get; set; }
        public int? RoleId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool  IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
