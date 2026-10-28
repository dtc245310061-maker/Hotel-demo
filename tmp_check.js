
    'use strict';
    const STORE_KEY = 'lumiere-hotel-demo-v2';
    const SESSION_KEY = 'lumiere-session';
    const HOTEL_HOTLINE = '1900 0000';
    const HOTEL_HOTLINE_IS_PLACEHOLDER = true;
    const money = value => new Intl.NumberFormat('vi-VN').format(Number(value) || 0) + 'đ';
    const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    const isoDate = offset => { const date = new Date(); date.setDate(date.getDate() + offset); return date.toISOString().slice(0,10); };
    const seed = {
      rooms:[
        {id:'L-203',type:'Deluxe Garden',floor:'Tầng 2',price:700000,status:'occupied',capacity:2,beds:'Giường đôi',features:'Ban công, bồn tắm'},
        {id:'L-305',type:'Premium River View',floor:'Tầng 3',price:980000,status:'available',capacity:2,beds:'Giường đôi',features:'View sông, bữa sáng'},
        {id:'L-401',type:'Family Suite',floor:'Tầng 4',price:1350000,status:'cleaning',capacity:4,beds:'2 giường đôi',features:'2 phòng ngủ, bếp nhỏ'},
        {id:'L-108',type:'Classic Courtyard',floor:'Tầng 1',price:650000,status:'maintenance',capacity:2,beds:'Giường đơn',features:'Sân trong, bàn làm việc'},
        {id:'L-212',type:'Deluxe Garden',floor:'Tầng 2',price:720000,status:'available',capacity:2,beds:'Giường đôi',features:'Ban công, bồn tắm'},
        {id:'L-502',type:'Lumière Suite',floor:'Tầng 5',price:1950000,status:'occupied',capacity:4,beds:'Giường đôi',features:'View thành phố, minibar'},
        {id:'L-114',type:'Classic Twin',floor:'Tầng 1',price:750000,status:'available',capacity:2,beds:'2 giường đơn',features:'Sân trong, bàn làm việc'},
        {id:'L-218',type:'Riverside Twin',floor:'Tầng 2',price:900000,status:'available',capacity:2,beds:'2 giường đơn',features:'View sông, bữa sáng'},
        {id:'L-306',type:'Family Garden',floor:'Tầng 3',price:1100000,status:'available',capacity:4,beds:'2 giường đôi',features:'Ban công, khu vui chơi'},
        {id:'L-604',type:'Panorama Suite',floor:'Tầng 6',price:2200000,status:'available',capacity:4,beds:'Giường đôi',features:'View toàn cảnh, phòng khách'},
        {id:'L-207',type:'Classic Garden',floor:'Tầng 2',price:800000,status:'available',capacity:2,beds:'Giường đôi',features:'Nhìn ra sân vườn, bàn làm việc'},
        {id:'L-308',type:'Premium Balcony',floor:'Tầng 3',price:1200000,status:'available',capacity:2,beds:'Giường đôi',features:'Ban công riêng, bồn tắm'},
        {id:'L-405',type:'Family Residence',floor:'Tầng 4',price:1500000,status:'available',capacity:4,beds:'2 giường đôi',features:'Phòng khách, khu vực ăn uống'},
        {id:'L-705',type:'Lumière Penthouse',floor:'Tầng 7',price:2750000,status:'available',capacity:4,beds:'Giường đôi',features:'Sân hiên riêng, view thành phố'}
      ],
      services:[
        {name:'Bữa sáng buffet',category:'Ẩm thực',price:280000,unit:'/ người',icon:'☕'},
        {name:'Đón sân bay',category:'Di chuyển',price:450000,unit:'/ chuyến',icon:'↗'},
        {name:'Massage thư giãn',category:'Wellness',price:650000,unit:'/ 60 phút',icon:'✦'},
        {name:'Giặt ủi nhanh',category:'Tiện ích',price:180000,unit:'/ túi',icon:'⌁'},
        {name:'Hoạt động thể thao',category:'Trải nghiệm',price:350000,unit:'/ người',icon:'⌖'},
        {name:'Tham quan du lịch',category:'Khám phá',price:850000,unit:'/ tour',icon:'⌂'},
        {name:'Nghe hát',category:'Giải trí',price:450000,unit:'/ buổi',icon:'♫'},
        {name:'Trà chiều bên sông',category:'Ẩm thực',price:320000,unit:'/ người',icon:'♨'},
        {name:'Thuê xe đạp',category:'Di chuyển',price:180000,unit:'/ ngày',icon:'↗'},
        {name:'Lớp yoga thư giãn',category:'Wellness',price:420000,unit:'/ người',icon:'✦'},
        {name:'Trang trí phòng dịp đặc biệt',category:'Trải nghiệm',price:1200000,unit:'/ phòng',icon:'❋'}
      ],
      users:[
        {email:'admin@lumiere.vn',password:'admin123',name:'Lê Thu Thùy',role:'admin',active:true,phone:''},
        {email:'guest@lumiere.vn',password:'guest123',name:'Nguyễn Minh Anh',role:'guest',active:true,phone:'090 123 4567'},
        {email:'nhanvien@lumiere.vn',password:'Abc12345',name:'Nguyễn Tuấn Anh',role:'staff',active:true,phone:'091 234 5678'}
      ],
      staffPool:[
        {id:'staff-demo-1',name:'Phạm Thu Hương',email:'nhanvien2@lumiere.vn',role:'staff',active:true,permissions:[],avatar:'',note:'Nhân viên ảo · không cần tài khoản đăng nhập',virtual:true},
        {id:'staff-demo-2',name:'Trần Minh Hoàng',email:'nhanvien3@lumiere.vn',role:'staff',active:true,permissions:[],avatar:'',note:'Nhân viên ảo · không cần tài khoản đăng nhập',virtual:true},
        {id:'staff-demo-3',name:'Lê Bảo Trâm',email:'nhanvien4@lumiere.vn',role:'staff',active:true,permissions:[],avatar:'',note:'Nhân viên ảo · không cần tài khoản đăng nhập',virtual:true},
        {id:'staff-demo-4',name:'Nguyễn Hữu Nam',email:'nhanvien5@lumiere.vn',role:'staff',active:true,permissions:[],avatar:'',note:'Nhân viên ảo · không cần tài khoản đăng nhập',virtual:true},
        {id:'staff-demo-5',name:'Vũ Thị Lan',email:'nhanvien6@lumiere.vn',role:'staff',active:true,permissions:[],avatar:'',note:'Nhân viên ảo · không cần tài khoản đăng nhập',virtual:true}
      ],
      bookings:[
        {id:'BK-24081',room:'L-203',type:'Deluxe Garden',guest:'Nguyễn Minh Anh',email:'guest@lumiere.vn',checkIn:'2026-09-22',checkOut:'2026-09-24',guests:2,amount:3700000,status:'Đang ở',services:[],paid:false},
        {id:'BK-24080',room:'L-502',type:'Lumière Suite',guest:'Trần Hoàng Long',email:'long@example.vn',checkIn:'2026-09-18',checkOut:'2026-09-22',guests:2,amount:19200000,status:'Đã xác nhận',services:[],paid:true},
        {id:'BK-24079',room:'L-305',type:'Premium River View',guest:'Lê Thu Hà',email:'ha@example.vn',checkIn:'2026-09-14',checkOut:'2026-09-16',guests:2,amount:4900000,status:'Đã trả phòng',services:[],paid:true}
      ],
      requests:[
        {id:'YC-1042',bookingId:'BK-24081',guest:'Nguyễn Minh Anh',room:'L-203',title:'Dọn phòng sau khi trả phòng',detail:'Kiểm tra minibar và vệ sinh phòng.',status:'Chờ tiếp nhận'},
        {id:'YC-1041',bookingId:'BK-24080',guest:'Trần Hoàng Long',room:'L-502',title:'Bữa sáng buffet',detail:'Chuẩn bị bữa sáng cho 2 khách.',status:'Đã tiếp nhận'}
      ],
      reviews:[
        {guest:'Lê Thu Hà',rating:5,comment:'Không gian rất đẹp, nhân viên chu đáo và bữa sáng ngon.'},
        {guest:'Phạm Gia Hân',rating:4,comment:'Phòng sạch, view đẹp, quy trình nhận phòng nhanh.'},
        {guest:'Trần Minh Khang',rating:5,comment:'Nhân viên hỗ trợ nhiệt tình, phòng yên tĩnh và thoải mái.'},
        {guest:'Hoàng Mai Chi',rating:4,comment:'Bữa sáng đa dạng, không gian sân vườn đẹp và nhiều góc thư giãn.'},
        {guest:'Đặng Hoàng Nam',rating:5,comment:'View sông tuyệt vời, nhận phòng nhanh và tư vấn dịch vụ rõ ràng.'},
        {guest:'Nguyễn Khánh Linh',rating:5,comment:'Phòng rộng, giường êm, đội ngũ hỗ trợ rất chu đáo.'},
        {guest:'Phan Đức Anh',rating:5,comment:'Gia đình có kỳ nghỉ đáng nhớ, các bạn nhỏ thích khu vui chơi.'},
        {guest:'Lý Thảo My',rating:4,comment:'Massage thư giãn tốt, không gian riêng tư và dễ chịu.'},
        {guest:'Bùi Quang Huy',rating:5,comment:'Tour tham quan được sắp xếp chu đáo, hướng dẫn viên thân thiện.'},
        {guest:'Võ Ngọc Anh',rating:4,comment:'Phòng sạch, yên tĩnh; dịch vụ giặt ủi nhanh và tiện lợi.'},
        {guest:'Hoàng Anh Khoa',rating:5,comment:'Thủ tục nhận phòng nhanh, phòng có ánh sáng đẹp và đầy đủ tiện nghi.'}
      ],
      session:null,
      serviceOrders:[],
      invoiceNotifications:[],
      readNotifications:false
    };
    let data;
    try {
      const stored = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      const hasStaleRoomPricing = Array.isArray(stored.rooms) && stored.rooms.some(room => {
        const expected = seed.rooms.find(item => item.id === room.id);
        return expected && Number(expected.price) !== Number(room.price);
      });
      if (hasStaleRoomPricing) {
        localStorage.removeItem(STORE_KEY);
        localStorage.removeItem(SESSION_KEY);
      }
      const fresh = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      const base = {...seed, ...fresh};
      const roomById = new Map((fresh.rooms || seed.rooms).map(room => [room.id, room]));
      base.rooms = seed.rooms.map(room => ({
        ...room,
        ...(roomById.get(room.id) || {}),
        price: room.price,
        status: roomById.get(room.id)?.status || room.status,
        image: roomById.get(room.id)?.image || room.image,
        features: roomById.get(room.id)?.features || room.features,
        floor: roomById.get(room.id)?.floor || room.floor,
        beds: roomById.get(room.id)?.beds || room.beds,
        capacity: roomById.get(room.id)?.capacity || room.capacity
      }));
      data = base;
    } catch { data = {...seed}; }
    for (const key of ['services','users','staffPool','bookings','requests','reviews','serviceOrders','invoiceNotifications']) {
      if (!Array.isArray(data[key])) data[key] = [...seed[key]];
      else {
        const identity = key === 'services' ? item => item.name : key === 'reviews' ? item => `${item.guest}|${item.comment}` : key === 'staffPool' ? item => item.email || item.id : item => item.email || item.id;
        const existing = new Set(data[key].map(identity));
        data[key].push(...seed[key].filter(item => !existing.has(identity(item))));
      }
    }
    if (!Array.isArray(data.rooms)) data.rooms = [...seed.rooms];
    try { data.session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { data.session = null; }
    let page = 'dashboard';
    let selectedRole = 'guest';
    let authMode = 'login';
    let notificationsOpen = false;
    let roomSearch = '';
    let selectedRoomId = '';
    let chatOpen = false;
    let chatMessages = [];
    let toastTimer;
    const syncDemoState = () => {
      const totals = data.bookings.reduce((acc, booking) => {
        const amount = Number(booking.amount || 0);
        acc.total += amount;
        if (booking.paid) acc.paid += amount;
        return acc;
      }, { total: 0, paid: 0 });
      data.aiContext = {
        lastUpdatedAt: new Date().toISOString(),
        rooms: data.rooms.map(room => ({ id: room.id, type: room.type, status: room.status, price: room.price, floor: room.floor, capacity: room.capacity })),
        services: data.services.map(service => ({ name: service.name, price: service.price, category: service.category, unit: service.unit })),
        staff: staffDirectory().map(member => ({ name: member.name, email: member.email || member.id, role: member.role, active: member.active, permissions: Array.isArray(member.permissions) ? member.permissions : [] })),
        bookings: data.bookings.map(booking => ({ id: booking.id, guest: booking.guest, email: booking.email, room: booking.room, type: booking.type, status: booking.status, amount: Number(booking.amount || 0), paid: Boolean(booking.paid) })),
        summary: {
          totalRevenue: totals.total,
          paidRevenue: totals.paid,
          unpaidRevenue: totals.total - totals.paid,
          availableRooms: data.rooms.filter(room => room.status === 'available').length,
          occupiedRooms: data.rooms.filter(room => room.status === 'occupied').length,
          reviewsCount: data.reviews.length
        }
      };
      return data.aiContext;
    };
    const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify({...data,session:null})); if(data.session) localStorage.setItem(SESSION_KEY,JSON.stringify(data.session)); else localStorage.removeItem(SESSION_KEY); syncDemoState(); } catch {} };
    const roleName = role => ({admin:'Quản trị viên',staff:'Nhân viên',guest:'Khách hàng'}[role] || 'Khách hàng');
    const roomStatus = status => ({available:'Sẵn sàng',occupied:'Đang ở',cleaning:'Đang dọn',maintenance:'Bảo trì'}[status] || status);
    const statusClass = status => status==='available'||status==='Đã xác nhận'?'':status==='occupied'||status==='Đang ở'?'warn':status==='maintenance'||status==='Đã hủy'?'bad':'gray';
    const normalizePhone = value => String(value || '').replace(/\D/g, '');
    const validatePhone = value => /^\d{10}$/.test(normalizePhone(value));
    const staffDirectory = () => [...(data.users||[]).filter(user=>user.role==='staff'), ...(data.staffPool||[])];
    const findStaffRecord = identifier => staffDirectory().find(staff => (staff.email || staff.id) === identifier) || null;
    const isAdmin = () => data.session?.role === 'admin';
    const notify = message => { const root=document.getElementById('toast-root'); root.innerHTML=`<div class="toast">${escapeHtml(message)}</div>`; clearTimeout(toastTimer); toastTimer=setTimeout(()=>root.innerHTML='',3000); };
    const getNotifications = () => {
      const items = Array.isArray(data.invoiceNotifications) ? [...data.invoiceNotifications].reverse() : [];
      if (items.length) {
        return items.slice(0, 5).map((item, index) => ({
          id: item.id || `notif-${index}`,
          title: item.title || `Hóa đơn ${item.id || 'mới'}`,
          detail: item.detail || `Đã có thông tin thanh toán cho ${item.recipient || 'khách hàng'}.`,
          time: item.issuedAt ? new Date(item.issuedAt).toLocaleString('vi-VN', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'}) : 'Vừa xong'
        }));
      }
      return [
        {id:'notif-demo-1', title:'Demo hệ thống', detail:'Dữ liệu đang được cập nhật để phục vụ demo Lumière Hotel.', time:'Vừa xong'},
        {id:'notif-demo-2', title:'Lưu trú mới', detail:'Có khách hàng cần xem xét đặt phòng theo mẫu demo.', time:'Hôm nay'}
      ];
    };
    const pageTitle = {dashboard:'Tổng quan',rooms:'Phòng',bookings:'Đặt phòng',services:'Dịch vụ',operations:'Vận hành',invoices:'Hóa đơn',reports:'Báo cáo doanh thu',staff:'Nhân viên',reviews:'Đánh giá',settings:'Cài đặt'};
    function navItems(){const role=data.session?.role;const base=role==='guest'?[['dashboard','⌂','Chào mừng'],['rooms','▤','Phòng còn trống'],['services','✦','Dịch vụ']]:[['dashboard','◫','Tổng quan'],['rooms','▤','Phòng'],['bookings','▧','Đặt phòng'],['services','✦','Dịch vụ'],['reviews','☆','Đánh giá']];if(role==='admin')base.push(['operations','⌁','Vận hành'],['reports','↗','Doanh thu'],['staff','♙','Nhân viên']);if(role==='staff')base.push(['operations','⌁','Vận hành']);if(role!=='guest')base.push(['settings','⚙','Cài đặt']);return base;}
    function render(){if(!data.session){renderAuth();return;}const app=document.getElementById('app');const nav=navItems();if(!nav.some(item=>item[0]===page))page='dashboard';const notifications=getNotifications();app.innerHTML=`<div class="app-shell"><aside class="sidebar" id="sidebar"><div class="brand"><span class="brand-mark">L</span><span>LUMIÈRE<small>HOTEL MANAGEMENT</small></span></div><span class="nav-label">Không gian làm việc</span><nav class="nav-list">${nav.map(([id,icon,label])=>`<button data-page="${id}" class="${page===id?'active':''}"><span class="nav-symbol">${icon}</span>${label}</button>`).join('')}</nav><div class="side-bottom"><div class="row"><span class="avatar">${escapeHtml(data.session.name.slice(0,1))}</span><span><strong>${escapeHtml(data.session.name)}</strong><br><span class="muted">${roleName(data.session.role)}</span></span></div><button class="text-button" data-action="logout" style="margin-top:13px">Đăng xuất</button></div></aside><main class="main-area"><header class="topbar"><div class="row"><button class="icon-button mobile-menu" data-action="menu" aria-label="Mở menu">☰</button><span class="topbar-title">Lumière Hotel &nbsp; / &nbsp; ${pageTitle[page]}</span></div><div class="top-actions"><div class="notification-wrap"><button class="icon-button notification-button ${notificationsOpen?'active':''}" data-action="notifications" aria-label="Thông báo">♧${notifications.length?`<span class="notification-badge">${notifications.length}</span>`:''}</button>${notificationsOpen?`<div class="notification-popover"><div class="notification-popover-header"><strong>Thông báo</strong><button class="text-button" data-action="mark-notifications-read">Đánh dấu đã đọc</button></div><div class="notification-popover-body">${notifications.map(item=>`<article class="notification-item"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p><time>${escapeHtml(item.time)}</time></article>`).join('')}</div></div>`:''}</div><span class="user-chip"><span class="avatar">${escapeHtml(data.session.name.slice(0,1))}</span><span>${escapeHtml(data.session.name)}</span></span></div></header><section class="page-wrap">${renderPage()}</section></main></div>${renderChat()}`;}
    function pageHead(title,description,action=''){return `<div class="page-head"><div><span class="eyebrow">Lumière Hotel</span><h1>${title}</h1><p>${description}</p></div>${action}</div>`;}
    function renderDashboard(){const total=data.rooms.length,available=data.rooms.filter(room=>room.status==='available').length,occupied=data.rooms.filter(room=>room.status==='occupied').length;const visibleBookings=isAdmin()?data.bookings:data.bookings.filter(booking=>booking.email===data.session.email);const income=data.bookings.reduce((sum,b)=>sum+(Number(b.amount)||0),0);const active=visibleBookings.filter(b=>!['Đã hủy','Đã trả phòng'].includes(b.status)).length;return `${pageHead(data.session.role==='admin'?'Bảng điều khiển':'Chào mừng trở lại',`Xin chào ${escapeHtml(data.session.name)}. Đây là tình hình lưu trú hiện tại.`)}<div class="stats"><article class="stat"><small>Phòng sẵn sàng</small><strong>${available}</strong><span>trên ${total} phòng</span></article><article class="stat"><small>Đang có khách</small><strong>${occupied}</strong><span>${total?Math.round(occupied/total*100):0}% công suất</span></article><article class="stat"><small>${isAdmin()?'Đặt phòng':'Lịch đặt của bạn'}</small><strong>${active}</strong><span>đang hoạt động</span></article><article class="stat"><small>${isAdmin()?'Doanh thu đặt phòng':'Dịch vụ khách sạn'}</small><strong>${isAdmin()?money(income):data.services.length}</strong><span>${isAdmin()?'tổng theo dữ liệu mẫu':'dịch vụ sẵn có'}</span></article></div><div class="grid-2"><section class="panel"><div class="panel-head"><h2>${isAdmin()?'Đặt phòng gần đây':'Kỳ lưu trú của bạn'}</h2><button class="text-button" data-page="bookings">Xem tất cả</button></div>${visibleBookings.length?visibleBookings.slice(0,4).map(booking=>bookingCard(booking,false)).join(''):'<div class="empty">Chưa có lịch đặt phòng.</div>'}</section><section class="panel"><div class="panel-head"><h2>Tình trạng phòng</h2><button class="text-button" data-page="rooms">Quản lý phòng</button></div><div class="metric-list"><div class="metric-line"><span>Sẵn sàng</span><strong>${available}</strong></div><div class="metric-line"><span>Đang ở</span><strong>${occupied}</strong></div><div class="metric-line"><span>Đang dọn</span><strong>${data.rooms.filter(r=>r.status==='cleaning').length}</strong></div><div class="metric-line"><span>Bảo trì</span><strong>${data.rooms.filter(r=>r.status==='maintenance').length}</strong></div></div><div class="notice" style="margin-top:14px">Dữ liệu được lưu trên trình duyệt này để phục vụ trình diễn.</div></section></div>`;}
    function roomCard(room){const available=room.status==='available';return `<article class="room-card"><div class="room-art"><span>${escapeHtml(room.type)}</span><span class="badge ${statusClass(room.status)}">${roomStatus(room.status)}</span></div><div class="room-body"><h3>${escapeHtml(room.id)} <span class="muted">· ${escapeHtml(room.floor)}</span></h3><div class="room-meta">${escapeHtml(room.beds)} · tối đa ${room.capacity} khách<br>${escapeHtml(room.features||'')}</div><div class="room-price">${money(room.price)} <span class="muted" style="font-size:10px;font-weight:400">/ đêm</span></div><div class="room-actions">${data.session.role==='guest'?(available?`<button class="primary" data-action="book" data-room="${escapeHtml(room.id)}">Đặt phòng</button>`:'<button class="secondary" disabled>Chưa sẵn sàng</button>'):isAdmin()?`<select aria-label="Trạng thái phòng" data-room-status="${escapeHtml(room.id)}">${Object.entries({available:'Sẵn sàng',occupied:'Đang ở',cleaning:'Đang dọn',maintenance:'Bảo trì'}).map(([key,label])=>`<option value="${key}" ${room.status===key?'selected':''}>${label}</option>`).join('')}</select><button class="secondary" data-action="edit-room" data-room="${escapeHtml(room.id)}">Sửa</button>`:''}</div></div></article>`;}
    function renderRooms(){const query=roomSearch.toLocaleLowerCase('vi');const rooms=data.rooms.filter(room=>`${room.id} ${room.type} ${room.floor}`.toLocaleLowerCase('vi').includes(query));return `${pageHead('Danh sách phòng','Theo dõi loại phòng, giá và trạng thái.',isAdmin()?'<button class="primary" data-action="add-room">+ Thêm phòng</button>':'')}<div class="toolbar"><input id="room-search" value="${escapeHtml(roomSearch)}" placeholder="Tìm theo mã hoặc loại phòng"><select id="room-filter"><option value="all">Tất cả trạng thái</option>${Object.entries({available:'Sẵn sàng',occupied:'Đang ở',cleaning:'Đang dọn',maintenance:'Bảo trì'}).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></div><div class="room-grid" id="room-grid">${rooms.length?rooms.map(roomCard).join(''):'<div class="empty">Không tìm thấy phòng phù hợp.</div>'}</div>`;}
    function bookingCard(booking,actions=true){const mine=booking.email===data.session.email;const canCancel=mine&&['Chờ xác nhận','Đã xác nhận'].includes(booking.status);return `<article class="booking-row"><span class="avatar">⌂</span><main><strong>${escapeHtml(booking.type)} · ${escapeHtml(booking.room)}</strong><small>${escapeHtml(booking.guest)} · ${escapeHtml(booking.checkIn)} → ${escapeHtml(booking.checkOut)} · ${booking.guests||2} khách</small></main><strong>${money(booking.amount)}</strong><span class="badge ${statusClass(booking.status)}">${escapeHtml(booking.status)}</span>${actions?`<div class="booking-actions">${isAdmin()?`<select data-booking-status="${escapeHtml(booking.id)}"><option ${booking.status==='Chờ xác nhận'?'selected':''}>Chờ xác nhận</option><option ${booking.status==='Đã xác nhận'?'selected':''}>Đã xác nhận</option><option ${booking.status==='Đang ở'?'selected':''}>Đang ở</option><option ${booking.status==='Đã trả phòng'?'selected':''}>Đã trả phòng</option><option ${booking.status==='Đã hủy'?'selected':''}>Đã hủy</option></select>${booking.status==='Đang ở'?`<button class="secondary" data-action="checkout" data-id="${escapeHtml(booking.id)}">Trả phòng</button>`:''}`:''}${canCancel?`<button class="danger" data-action="cancel-booking" data-id="${escapeHtml(booking.id)}">Hủy đặt</button>`:''}${booking.status==='Đã trả phòng'&&mine?`<button class="secondary" data-action="review" data-id="${escapeHtml(booking.id)}">Đánh giá</button>`:''}</div>`:''}</article>`;}
    function renderBookings(){const bookings=isAdmin()?data.bookings:data.bookings.filter(b=>b.email===data.session.email);return `${pageHead(isAdmin()?'Quản lý đặt phòng':'Lịch đặt phòng','Theo dõi trạng thái và thông tin lưu trú.')}${bookings.length?bookings.map(b=>bookingCard(b)).join(''):'<section class="panel empty">Bạn chưa có đặt phòng nào. <button class="text-button" data-page="rooms">Khám phá phòng</button></section>'}`;}
    function renderServices(){return `${pageHead('Dịch vụ khách sạn','Bảng giá các tiện ích hiện có.',isAdmin()?'<button class="primary" data-action="add-service">+ Thêm dịch vụ</button>':'')}<div class="service-grid">${data.services.map(service=>`<article class="service-row"><span class="service-icon">${escapeHtml(service.icon||'✦')}</span><main><strong>${escapeHtml(service.name)}</strong><small>${escapeHtml(service.category)} · ${money(service.price)} ${escapeHtml(service.unit)}</small></main>${isAdmin()?`<button class="secondary" data-action="edit-service" data-name="${escapeHtml(service.name)}">Sửa</button><button class="danger" data-action="delete-service" data-name="${escapeHtml(service.name)}">Xóa</button>`:''}</article>`).join('')}</div>`;}
    function renderOperations(){if(data.session.role==='guest')return '<section class="panel empty">Bạn không có quyền xem khu vực vận hành.</section>';return `${pageHead('Vận hành','Tiếp nhận yêu cầu dịch vụ và theo dõi hóa đơn.') }<section class="panel"><div class="panel-head"><h2>Yêu cầu đang xử lý</h2></div>${data.requests.length?data.requests.map(request=>`<div class="booking-row"><span class="avatar">⌁</span><main><strong>${escapeHtml(request.title)}</strong><small>${escapeHtml(request.id)} · ${escapeHtml(request.bookingId)} · ${escapeHtml(request.guest)} · phòng ${escapeHtml(request.room)}<br>${escapeHtml(request.detail)}</small></main><select data-request-status="${escapeHtml(request.id)}"><option ${request.status==='Chờ tiếp nhận'?'selected':''}>Chờ tiếp nhận</option><option ${request.status==='Đã tiếp nhận'?'selected':''}>Đã tiếp nhận</option><option ${request.status==='Đang xử lý'?'selected':''}>Đang xử lý</option><option ${request.status==='Hoàn tất'?'selected':''}>Hoàn tất</option></select></div>`).join(''):'<div class="empty">Chưa có yêu cầu.</div>'}</section><section class="panel"><div class="panel-head"><h2>Hóa đơn đặt phòng</h2></div><div class="table-wrap"><table><thead><tr><th>Mã đặt phòng</th><th>Khách hàng</th><th>Số tiền</th><th>Thanh toán</th></tr></thead><tbody>${data.bookings.map(b=>`<tr><td>${escapeHtml(b.id)}</td><td>${escapeHtml(b.guest)}</td><td>${money(b.amount)}</td><td><label class="check-row"><input type="checkbox" data-paid="${escapeHtml(b.id)}" ${b.paid?'checked':''}> Đã thanh toán</label></td></tr>`).join('')}</tbody></table></div></section>`;}
    function renderReports(){if(!isAdmin())return '<section class="panel empty">Bạn không có quyền xem báo cáo doanh thu.</section>';const total=data.bookings.reduce((n,b)=>n+Number(b.amount||0),0),paid=data.bookings.filter(b=>b.paid).reduce((n,b)=>n+Number(b.amount||0),0),unpaid=total-paid;return `${pageHead('Báo cáo doanh thu','Tổng hợp từ dữ liệu đặt phòng mẫu.','<div class="row"><button class="secondary" data-action="print-report">In / Xuất PDF</button></div>')}<section class="report-shell"><div class="report-head"><div><span class="eyebrow">Lumière Hotel</span><h2 style="margin:4px 0 0;font-size:24px;">Báo cáo doanh thu</h2></div><div class="report-actions"><button class="secondary" data-action="print-report">In / Xuất PDF</button></div></div><div class="stats"><article class="stat"><small>Tổng doanh thu</small><strong>${money(total)}</strong><span>${data.bookings.length} đặt phòng</span></article><article class="stat"><small>Đã thanh toán</small><strong>${money(paid)}</strong><span>đã ghi nhận</span></article><article class="stat"><small>Còn phải thu</small><strong>${money(unpaid)}</strong><span>chưa thanh toán</span></article><article class="stat"><small>Giá dịch vụ hiện có</small><strong>${data.services.length}</strong><span>loại dịch vụ</span></article></div><section class="panel"><div class="panel-head"><h2>Chi tiết đặt phòng</h2><span class="report-legend">Cập nhật đồng bộ: ${new Date().toLocaleString('vi-VN')}</span></div><div class="table-wrap"><table><thead><tr><th>Mã</th><th>Khách hàng</th><th>Phòng</th><th>Trạng thái</th><th>Số tiền</th><th>Thanh toán</th></tr></thead><tbody>${data.bookings.map(b=>`<tr><td>${escapeHtml(b.id)}</td><td>${escapeHtml(b.guest)}</td><td>${escapeHtml(b.room)}</td><td>${escapeHtml(b.status)}</td><td>${money(b.amount)}</td><td>${b.paid?'Đã thanh toán':'Chưa thanh toán'}</td></tr>`).join('')}</tbody></table></div></section></section>`;}
    function renderStaff(){if(!isAdmin())return '<section class="panel empty">Bạn không có quyền quản lý nhân viên.</section>';const staff=data.users.filter(user=>user.role==='staff');return `${pageHead('Nhân viên','Quản lý tài khoản nhân viên của bản demo.','<button class="primary" data-action="add-staff">+ Thêm nhân viên</button>')}<section class="panel"><div class="table-wrap"><table><thead><tr><th>Nhân viên</th><th>Email</th><th>Trạng thái</th><th>Quyền</th></tr></thead><tbody>${staff.map(user=>`<tr><td>${escapeHtml(user.name)}</td><td>${escapeHtml(user.email)}</td><td>${user.active?'Đang hoạt động':'Đã khóa'}</td><td><button class="secondary" data-action="toggle-staff" data-email="${escapeHtml(user.email)}">${user.active?'Khóa':'Mở khóa'}</button></td></tr>`).join('')}</tbody></table></div></section>`;}
    function renderReviews(){const avg=data.reviews.length?(data.reviews.reduce((n,r)=>n+r.rating,0)/data.reviews.length).toFixed(1):'0.0';return `${pageHead('Đánh giá','Nhận xét từ khách lưu trú.') }<section class="panel"><div class="row"><strong style="font:500 33px Georgia,serif">${avg}</strong><span class="rating">★★★★★</span><span class="muted">${data.reviews.length} đánh giá</span></div></section><div class="service-grid">${data.reviews.map(review=>`<article class="panel"><div class="panel-head"><strong>${escapeHtml(review.guest)}</strong><span class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span></div><p style="font-size:12px;line-height:1.7;color:var(--muted)">${escapeHtml(review.comment)}</p></article>`).join('')}</div>`;}
    function renderSettings(){return `${pageHead('Cài đặt tài khoản','Cập nhật thông tin hiển thị của bạn.') }<section class="panel" style="max-width:640px"><form id="settings-form" class="stack"><label class="field">Họ và tên<input name="name" required value="${escapeHtml(data.session.name)}"></label><label class="field">Email<input value="${escapeHtml(data.session.email)}" disabled></label><label class="field">Số điện thoại<input name="phone" value="${escapeHtml(data.session.phone||'')}"></label><div><button class="primary">Lưu thay đổi</button></div></form></section>`;}
    function renderPage(){return ({dashboard:renderDashboard,rooms:renderRooms,bookings:renderBookings,services:renderServices,operations:renderOperations,reports:renderReports,staff:renderStaff,reviews:renderReviews,settings:renderSettings}[page]||renderDashboard)();}
    function renderAuth(){const app=document.getElementById('app');const headings={login:['Đăng nhập','Đăng nhập để tiếp tục đến không gian quản lý.'],register:['Tạo tài khoản','Đăng ký tài khoản khách hàng mới.'],forgot:['Khôi phục mật khẩu','Nhập email để xem hướng dẫn đặt lại mật khẩu demo.']};const [title,description]=headings[authMode];app.innerHTML=`<main class="auth-screen"><section class="auth-visual"><div><div class="brand"><span class="brand-mark">L</span><span>LUMIÈRE<small>HOTEL MANAGEMENT</small></span></div><span class="eyebrow" style="color:#e3c47d">Lưu trú, được chăm chút</span><h1>Một kỳ nghỉ bắt đầu từ sự an tâm.</h1><p>Không gian quản lý khách sạn Lumière Hotel, dành cho khách lưu trú và đội ngũ vận hành.</p></div><small>© Lumière Hotel · Bản demo quản lý lưu trú</small></section><section class="auth-form-side"><div class="auth-box"><span class="eyebrow">Chào mừng đến Lumière</span><h2>${title}</h2><p class="muted" style="font-size:12px;line-height:1.6">${description}</p>${authMode==='login'?`<div class="role-switch">${[['guest','Khách hàng'],['staff','Nhân viên'],['admin','Quản trị']].map(([role,label])=>`<button data-role="${role}" class="${selectedRole===role?'selected':''}">${label}</button>`).join('')}</div>`:''}<form id="auth-form" class="stack">${authMode==='register'?'<label class="field">Họ và tên<input name="name" required autocomplete="name"></label><label class="field">Số điện thoại<input name="phone" autocomplete="tel" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" required></label>':''}<label class="field">Email<input name="email" type="email" required autocomplete="username"></label>${authMode!=='forgot'?'<label class="field">Mật khẩu<input name="password" type="password" required autocomplete="current-password"></label>':''}<button class="primary" style="padding:12px">${authMode==='login'?'Đăng nhập':authMode==='register'?'Tạo tài khoản':'Gửi hướng dẫn'}</button></form><div class="auth-links">${authMode==='login'?'<button class="text-button" data-auth="register">Đăng ký</button><button class="text-button" data-auth="forgot">Quên mật khẩu?</button>':`<button class="text-button" data-auth="login">Quay lại đăng nhập</button>`}</div><p class="muted" style="font-size:10px;margin-top:24px">Bản demo dùng dữ liệu trình diễn lưu trong trình duyệt.</p></div></section></main>`;}
    function renderChat(){const title=data.session.role==='admin'?'Hỗ trợ báo cáo và vận hành':'Tư vấn phòng, giá và dịch vụ';const welcome=data.session.role==='admin'?'Xin chào. Tôi có thể tra cứu doanh thu, tình trạng phòng, đặt phòng và dịch vụ từ dữ liệu demo.':'Xin chào. Tôi có thể tìm phòng phù hợp, kiểm tra giá, dịch vụ, đánh giá và lịch đặt của bạn.';if(!chatMessages.length)chatMessages=[{from:'ai',text:welcome}];return `<div class="chat-wrap">${chatOpen?`<section class="chat-panel"><header class="chat-head"><div><strong>Lumière AI</strong><small>${title} · Trợ lý quy tắc theo dữ liệu demo</small></div><button data-action="chat-close" aria-label="Đóng chat">×</button></header><div class="chat-log" id="chat-log">${chatMessages.map(message=>`<div class="chat-message ${message.from}">${escapeHtml(message.text)}</div>`).join('')}</div><div class="suggestions">${(isAdmin()?['Báo cáo doanh thu','Phòng nào đang trống?','Đặt phòng chờ xác nhận']:['Gợi ý phòng dưới 3 triệu cho 3 người','Dịch vụ dưới 500 nghìn','Lịch đặt của tôi']).map(text=>`<button data-question="${escapeHtml(text)}">${escapeHtml(text)}</button>`).join('')}</div><form id="chat-form" class="chat-form"><input name="question" placeholder="Nhập câu hỏi..." aria-label="Nhập câu hỏi cho Lumière AI" autocomplete="off"><button aria-label="Gửi câu hỏi">Gửi</button></form></section>`:`<button class="chat-toggle" data-action="chat-open"><span>✦</span>Lumière AI</button>`}</div>`;}
    function openModal(title,body){document.getElementById('modal-root').innerHTML=`<div class="overlay" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}"><div class="panel-head"><h2>${escapeHtml(title)}</h2><button class="icon-button" data-action="close-modal" aria-label="Đóng">×</button></div>${body}</section></div>`;}
    function closeModal(){document.getElementById('modal-root').innerHTML='';}
    function bookRoom(roomId){const room=data.rooms.find(item=>item.id===roomId);if(!room||room.status!=='available')return;const services=data.services;openModal('Đặt phòng',`<form id="booking-form"><div class="notice" style="margin-bottom:14px">${escapeHtml(room.type)} · ${money(room.price)} mỗi đêm · tối đa ${room.capacity} khách</div><div class="form-grid"><label class="field">Ngày nhận phòng<input name="checkIn" type="date" required min="${isoDate(0)}" value="${isoDate(1)}"></label><label class="field">Ngày trả phòng<input name="checkOut" type="date" required min="${isoDate(1)}" value="${isoDate(2)}"></label><label class="field">Số khách<input name="guests" type="number" min="1" max="${room.capacity}" value="1" required></label><div class="field wide">Dịch vụ thêm${services.map((service,index)=>`<label class="check-row"><input type="checkbox" name="service" value="${index}"> ${escapeHtml(service.name)} · ${money(service.price)}</label>`).join('')}</div></div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Đóng</button><button class="primary">Xác nhận đặt phòng</button></div></form>`);}
    function showRoomForm(room){const editing=!!room;openModal(editing?'Sửa thông tin phòng':'Thêm phòng',`<form id="room-form"><input type="hidden" name="originalId" value="${escapeHtml(room?.id||'')}"><div class="form-grid"><label class="field">Mã phòng<input name="id" required value="${escapeHtml(room?.id||'')}"></label><label class="field">Loại phòng<input name="type" required value="${escapeHtml(room?.type||'')}"></label><label class="field">Giá mỗi đêm<input name="price" type="number" min="1" required value="${room?.price||''}"></label><label class="field">Sức chứa<input name="capacity" type="number" min="1" required value="${room?.capacity||2}"></label><label class="field">Tầng<input name="floor" value="${escapeHtml(room?.floor||'')}"></label><label class="field">Loại giường<input name="beds" value="${escapeHtml(room?.beds||'Giường đôi')}"></label><label class="field wide">Tiện nghi<input name="features" value="${escapeHtml(room?.features||'')}"></label></div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Hủy</button><button class="primary">Lưu phòng</button></div></form>`);}
    function showServiceForm(service){const editing=!!service;openModal(editing?'Sửa dịch vụ':'Thêm dịch vụ',`<form id="service-form"><input type="hidden" name="originalName" value="${escapeHtml(service?.name||'')}"><div class="stack"><label class="field">Tên dịch vụ<input name="name" required value="${escapeHtml(service?.name||'')}"></label><label class="field">Danh mục<input name="category" required value="${escapeHtml(service?.category||'')}"></label><label class="field">Giá<input name="price" type="number" min="1" required value="${service?.price||''}"></label><label class="field">Đơn vị<input name="unit" value="${escapeHtml(service?.unit||'')}"></label></div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Hủy</button><button class="primary">Lưu dịch vụ</button></div></form>`);}
    function showStaffForm(){openModal('Thêm nhân viên ảo',`<form id="staff-form"><div class="stack"><label class="field">Họ và tên<input name="name" required></label><label class="field">Email demo<input name="email" type="email" required placeholder="vd: staff.demo@lumiere.vn"></label><label class="field">Ghi chú<textarea name="note" rows="3" placeholder="Ví dụ: Nhân viên hỗ trợ lễ tân, không cần tài khoản đăng nhập."></textarea></label><small class="muted">Nhân viên ảo chỉ hiện trong demo để admin cấp quyền; không cần tài khoản đăng nhập.</small></div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Hủy</button><button class="primary">Thêm nhân viên</button></div></form>`);}
    function showReviewForm(bookingId){openModal('Đánh giá kỳ lưu trú',`<form id="review-form"><input type="hidden" name="bookingId" value="${escapeHtml(bookingId)}"><div class="stack"><label class="field">Số sao<select name="rating"><option value="5">5 sao</option><option value="4">4 sao</option><option value="3">3 sao</option><option value="2">2 sao</option><option value="1">1 sao</option></select></label><label class="field">Nhận xét<textarea name="comment" required maxlength="500"></textarea></label></div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Hủy</button><button class="primary">Gửi đánh giá</button></div></form>`);}
    function login(email,password,role){const user=data.users.find(item=>item.email.toLowerCase()===email.toLowerCase()&&item.password===password&&item.role===role&&item.active);if(!user){notify('Thông tin đăng nhập chưa đúng hoặc tài khoản đã bị khóa.');return false;}data.session={email:user.email,name:user.name,role:user.role,phone:user.phone||''};page='dashboard';chatMessages=[];save();render();return true;}
    function normalize(text){return String(text).toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9., ]/g,' ').replace(/\s+/g,' ').trim();}
    function parseBudget(text){let match=text.match(/(?:duoi|toi da|ngan sach|khong qua|tam)/);match=text.match(/(?:duoi|toi da|ngan sach|khong qua|tam)?\s*(\d+(?:[.,]\d+)?)\s*(trieu|tr|nghin|ngan|k|vnd|dong)?/);if(!match)return null;const num=Number(match[1].replace(',','.'));const unit=match[2]||'';if(unit==='trieu'||unit==='tr')return num*1000000;if(unit==='nghin'||unit==='ngan'||unit==='k')return num*1000;if(unit==='vnd'||unit==='dong')return num;return num>=1000?num:null;}
    function answerQuestion(question){syncDemoState();const q=normalize(question);const userBookings=data.bookings.filter(b=>b.email===data.session.email);const rooms=data.rooms.filter(r=>r.status==='available');const guestMatch=q.match(/(\d+)\s*(?:khach|nguoi)/);const guestCount=guestMatch?Number(guestMatch[1]):null;const budget=parseBudget(q);const services=data.services;const total=data.bookings.reduce((n,b)=>n+Number(b.amount||0),0);const paid=data.bookings.filter(b=>b.paid).reduce((n,b)=>n+Number(b.amount||0),0);const avg=data.reviews.length?(data.reviews.reduce((n,r)=>n+r.rating,0)/data.reviews.length).toFixed(1):'0.0';
      if(/^(xin chao|chao|hello|hi|hey|alo)( lumiere)?$/.test(q))return `Xin chào ${data.session.name.split(' ').pop()}! Bạn muốn hỏi về phòng, giá, đặt phòng, dịch vụ hay đánh giá?`;
      if(q.includes('thuat toan')||q.includes('ai hoat dong')||q.includes('cach ai')||q.includes('ban la ai'))return 'Tôi là trợ lý quy tắc chạy ngay trong trình duyệt, không gửi dữ liệu ra dịch vụ AI bên ngoài. Tôi nhận diện nhóm câu hỏi tiếng Việt rồi tra cứu trạng thái phòng, giá, dịch vụ, đánh giá và đặt phòng hiện có. Với câu hỏi ngoài dữ liệu demo, tôi sẽ nói rõ thay vì tự tạo thông tin.';
      if(isAdmin()&&(q.includes('doanh thu')||q.includes('doanh so')||q.includes('cong no')||q.includes('da thu')||q.includes('bao cao')||q.includes('tien phong')))return `Báo cáo theo dữ liệu hiện tại: tổng giá trị đặt phòng ${money(total)}, đã thanh toán ${money(paid)}, còn phải thu ${money(total-paid)} trên ${data.bookings.length} lượt đặt. Đây là tổng dữ liệu demo, không phải số liệu kế toán thực.`;
      if(isAdmin()&&(q.includes('cong suat')||q.includes('phong dang o')||q.includes('tinh trang phong')))return `Hiện có ${rooms.length} phòng sẵn sàng, ${data.rooms.filter(r=>r.status==='occupied').length} phòng đang có khách, ${data.rooms.filter(r=>r.status==='cleaning').length} phòng đang dọn và ${data.rooms.filter(r=>r.status==='maintenance').length} phòng bảo trì.`;
      if(q.includes('lich dat cua toi')||q.includes('dat phong cua toi')||q.includes('booking cua toi'))return userBookings.length?`Bạn có ${userBookings.length} lượt đặt: ${userBookings.map(b=>`${b.id}, phòng ${b.room}, ${b.checkIn} đến ${b.checkOut}, trạng thái ${b.status}`).join('; ')}.`:'Email tài khoản này chưa có lượt đặt phòng nào.';
      if(q.includes('danh gia')||q.includes('nhan xet')||q.includes('review'))return data.reviews.length?`Điểm trung bình hiện là ${avg}/5 từ ${data.reviews.length} đánh giá. Nhận xét gần nhất: “${data.reviews[0].comment}”`:'Hiện chưa có đánh giá nào.';
      if(q.includes('dich vu')||q.includes('massage')||q.includes('buffet')||q.includes('giat ui')||q.includes('don san bay')){const matching=services.filter(s=>!budget||s.price<=budget);return matching.length?`Dịch vụ${budget?` trong mức ${money(budget)}`:''}: ${matching.map(s=>`${s.name} ${money(s.price)} ${s.unit}`).join('; ')}.`:'Chưa có dịch vụ phù hợp mức giá đó. Bạn có thể hỏi bảng giá đầy đủ.';}
      if(q.includes('gia')||q.includes('bao nhieu')||q.includes('chi phi')||q.includes('ngan sach')||budget){const matches=rooms.filter(r=>(!budget||r.price<=budget)&&(!guestCount||r.capacity>=guestCount)&&(!q.includes('giuong don')||normalize(r.beds).includes('giuong don'))&&(!q.includes('giuong doi')||normalize(r.beds).includes('giuong doi')));if(matches.length)return `Phòng đang sẵn sàng phù hợp${guestCount?` ${guestCount} khách`:''}${budget?` và ngân sách ${money(budget)}/đêm`:''}: ${matches.map(r=>`${r.type} (${r.id}), ${money(r.price)}/đêm, tối đa ${r.capacity} khách`).join('; ')}.`;return budget||guestCount?'Hiện chưa có phòng trống phù hợp các điều kiện đó. Thử tăng ngân sách hoặc giảm số khách nhé.':`Giá phòng trống từ ${rooms.length?money(Math.min(...rooms.map(r=>r.price))):'chưa có'} đến ${rooms.length?money(Math.max(...rooms.map(r=>r.price))):'chưa có'} mỗi đêm.`;}
      if(q.includes('phong')||q.includes('room'))return rooms.length?`Có ${rooms.length} phòng sẵn sàng: ${rooms.map(r=>`${r.type} (${r.id}, ${money(r.price)}/đêm, ${r.beds})`).join('; ')}.`:'Hiện chưa có phòng sẵn sàng.';
      if(q.includes('dat phong')||q.includes('huy phong')||q.includes('huy dat'))return 'Để đặt phòng, mở mục Phòng, chọn phòng có trạng thái Sẵn sàng rồi điền ngày lưu trú và số khách. Bạn có thể hủy lượt đặt đang chờ xác nhận hoặc đã xác nhận trong mục Đặt phòng.';
      if(q.includes('check in')||q.includes('check out')||q.includes('nhan phong')||q.includes('tra phong'))return 'Trong bản demo, ngày nhận/trả phòng được chọn trong biểu mẫu đặt phòng. Quy định giờ nhận phòng, trả phòng và phụ phí chưa được khai báo trong dữ liệu, nên tôi không tự suy đoán.';
      if(q.includes('dang nhap')||q.includes('tai khoan')||q.includes('mat khau')||q.includes('quen mat khau'))return 'Bạn có thể đăng ký tài khoản khách hàng từ màn hình đăng nhập. Tính năng quên mật khẩu chỉ mô phỏng trong bản demo, chưa gửi email thật.';
      if(q.includes('xin loi')||q.includes('cam on'))return 'Rất vui được hỗ trợ. Bạn cứ hỏi về phòng, giá, dịch vụ, đánh giá hoặc đặt phòng nhé.';
      return 'Tôi chưa tìm thấy dữ liệu để trả lời câu này. Tôi hỗ trợ tra cứu phòng trống, giá và ngân sách, dịch vụ, đánh giá, lịch đặt; tài khoản quản trị còn có thể hỏi doanh thu và tình trạng vận hành. Hãy thử hỏi cụ thể hơn.';
    }
    function sendChat(question){const text=String(question||'').trim();if(!text)return;chatMessages.push({from:'user',text},{from:'ai',text:answerQuestion(text)});chatMessages=chatMessages.slice(-24);chatOpen=true;render();const log=document.getElementById('chat-log');if(log)log.scrollTop=log.scrollHeight;}
    document.addEventListener('click',event=>{
      const pageButton=event.target.closest('[data-page]');
      if(pageButton){page=pageButton.dataset.page;document.getElementById('sidebar')?.classList.remove('open');render();return;}
      const roleButton=event.target.closest('[data-role]');
      if(roleButton){selectedRole=roleButton.dataset.role;renderAuth();return;}
      const authButton=event.target.closest('[data-auth]');
      if(authButton){authMode=authButton.dataset.auth;renderAuth();return;}
      const questionButton=event.target.closest('[data-question]');
      if(questionButton){sendChat(questionButton.dataset.question);return;}
      const actionButton=event.target.closest('[data-action]');
      if(!actionButton)return;
      const action=actionButton.dataset.action;
      switch(action){
        case'menu':document.getElementById('sidebar')?.classList.toggle('open');break;
        case'logout':data.session=null;save();chatMessages=[];render();break;
        case'chat-open':chatOpen=true;render();break;
        case'chat-close':chatOpen=false;render();break;
        case'close-modal':if(event.target.classList.contains('overlay')||event.target===actionButton)closeModal();break;
        case'book':bookRoom(actionButton.dataset.room);break;
        case'add-room':showRoomForm();break;
        case'edit-room':showRoomForm(data.rooms.find(r=>r.id===actionButton.dataset.room));break;
        case'add-service':showServiceForm();break;
        case'edit-service':showServiceForm(data.services.find(s=>s.name===actionButton.dataset.name));break;
        case'delete-service':data.services=data.services.filter(s=>s.name!==actionButton.dataset.name);save();render();notify('Đã xóa dịch vụ.');break;
        case'add-staff':showStaffForm();break;
        case'toggle-staff':{const user=findStaffRecord(actionButton.dataset.email);if(user){user.active=!user.active;save();render();notify(user.virtual?'Đã cập nhật trạng thái nhân viên ảo.':'Đã cập nhật tài khoản nhân viên.');}break;}
        case'cancel-booking':{const booking=data.bookings.find(b=>b.id===actionButton.dataset.id);if(booking){booking.status='Đã hủy';const room=data.rooms.find(r=>r.id===booking.room);if(room)room.status='available';save();render();notify('Đã hủy đặt phòng.');}break;}
        case'checkout':{const booking=data.bookings.find(b=>b.id===actionButton.dataset.id);if(booking){booking.status='Đã trả phòng';const room=data.rooms.find(r=>r.id===booking.room);if(room)room.status='cleaning';data.requests.unshift({id:`YC-${Date.now().toString().slice(-4)}`,bookingId:booking.id,guest:booking.guest,room:booking.room,title:'Dọn phòng sau khi trả phòng',detail:'Kiểm tra phòng và chuyển sang trạng thái chờ vệ sinh.',status:'Chờ tiếp nhận'});save();render();notify('Đã trả phòng và tạo yêu cầu vệ sinh.');}break;}
        case'review':showReviewForm(actionButton.dataset.id);break;
        case'notifications':notify(data.bookings.length?`Có ${data.bookings.length} lượt đặt phòng trong dữ liệu demo.`:'Chưa có thông báo mới.');break;
      }
    });
    document.addEventListener('input',event=>{if(event.target.id==='room-search'){roomSearch=event.target.value;const query=normalize(roomSearch);const rooms=data.rooms.filter(r=>normalize(`${r.id} ${r.type} ${r.floor}`).includes(query));const grid=document.getElementById('room-grid');if(grid)grid.innerHTML=rooms.length?rooms.map(roomCard).join(''):'<div class="empty">Không tìm thấy phòng phù hợp.</div>';}});
    document.addEventListener('change',event=>{const target=event.target;if(target.id==='room-filter'){const status=target.value;const query=normalize(roomSearch);const rooms=data.rooms.filter(r=>(status==='all'||r.status===status)&&normalize(`${r.id} ${r.type} ${r.floor}`).includes(query));document.getElementById('room-grid').innerHTML=rooms.length?rooms.map(roomCard).join(''):'<div class="empty">Không có phòng phù hợp.</div>';return;}if(target.dataset.roomStatus){const room=data.rooms.find(r=>r.id===target.dataset.roomStatus);if(room){room.status=target.value;save();render();notify('Đã cập nhật trạng thái phòng.');}}if(target.dataset.bookingStatus){const booking=data.bookings.find(b=>b.id===target.dataset.bookingStatus);if(booking){booking.status=target.value;save();render();notify('Đã cập nhật trạng thái đặt phòng.');}}if(target.dataset.requestStatus){const request=data.requests.find(r=>r.id===target.dataset.requestStatus);if(request){request.status=target.value;save();notify('Đã cập nhật yêu cầu.');}}if(target.dataset.paid){const booking=data.bookings.find(b=>b.id===target.dataset.paid);if(booking){booking.paid=target.checked;save();}}});
    document.addEventListener('submit',event=>{const form=event.target;event.preventDefault();const values=Object.fromEntries(new FormData(form).entries());if(form.id==='auth-form'){if(authMode==='login'){login(values.email,values.password,selectedRole);return;}if(authMode==='register'){if(data.users.some(user=>user.email.toLowerCase()===values.email.toLowerCase())){notify('Email này đã được đăng ký.');return;}const user={email:values.email,password:values.password,name:values.name,phone:values.phone||'',role:'guest',active:true};data.users.push(user);data.session={email:user.email,name:user.name,role:'guest',phone:user.phone};save();render();notify('Tạo tài khoản thành công.');return;}notify('Nếu email thuộc tài khoản demo, hướng dẫn sẽ được gửi theo quy trình thật khi tích hợp backend.');authMode='login';render();return;}if(form.id==='chat-form'){sendChat(values.question);return;}if(form.id==='booking-form'){const roomId=document.querySelector('#modal-root [data-room]')?.dataset.room;const room=data.rooms.find(r=>r.id===roomId);const checkIn=new Date(values.checkIn),checkOut=new Date(values.checkOut);if(!room){notify('Không tìm thấy phòng.');return;}if(checkOut<=checkIn){notify('Ngày trả phòng phải sau ngày nhận phòng.');return;}const nights=Math.max(1,Math.round((checkOut-checkIn)/86400000));const selected=[...form.querySelectorAll('input[name="service"]:checked')].map(input=>data.services[Number(input.value)]).filter(Boolean);const amount=room.price*nights+selected.reduce((sum,s)=>sum+s.price,0);const booking={id:`BK-${Date.now().toString().slice(-6)}`,room:room.id,type:room.type,guest:data.session.name,email:data.session.email,checkIn:values.checkIn,checkOut:values.checkOut,guests:Number(values.guests),amount,status:'Chờ xác nhận',services:selected,paid:false};data.bookings.unshift(booking);room.status='occupied';for(const service of selected)data.requests.unshift({id:`YC-${Date.now().toString().slice(-4)}`,bookingId:booking.id,guest:booking.guest,room:room.id,title:service.name,detail:`Khách đặt dịch vụ ${service.name}.`,status:'Chờ tiếp nhận'});save();closeModal();page='bookings';render();notify('Đã tạo lượt đặt phòng.');return;}if(form.id==='room-form'){const original=values.originalId;const room={id:values.id.trim(),type:values.type.trim(),floor:values.floor.trim(),price:Number(values.price),capacity:Number(values.capacity),beds:values.beds.trim(),features:values.features.trim(),status:'available'};if(!original&&data.rooms.some(r=>r.id===room.id)){notify('Mã phòng đã tồn tại.');return;}if(original){data.rooms=data.rooms.map(r=>r.id===original?{...r,...room,status:r.status}:r);}else data.rooms.push(room);save();closeModal();render();notify('Đã lưu thông tin phòng.');return;}if(form.id==='service-form'){const service={name:values.name.trim(),category:values.category.trim(),price:Number(values.price),unit:values.unit.trim(),icon:'✦'};if(values.originalName)data.services=data.services.map(s=>s.name===values.originalName?service:s);else data.services.push(service);save();closeModal();render();notify('Đã lưu dịch vụ.');return;}if(form.id==='staff-form'){if(data.users.some(u=>u.email.toLowerCase()===values.email.toLowerCase())){notify('Email đã tồn tại.');return;}data.users.push({name:values.name,email:values.email,password:values.password,role:'staff',active:true,phone:''});save();closeModal();render();notify('Đã tạo tài khoản nhân viên.');return;}if(form.id==='settings-form'){data.session.name=values.name.trim();data.session.phone=values.phone.trim();const user=data.users.find(u=>u.email===data.session.email);if(user){user.name=data.session.name;user.phone=data.session.phone;}save();render();notify('Đã lưu cài đặt tài khoản.');return;}if(form.id==='review-form'){data.reviews.unshift({guest:data.session.name,rating:Number(values.rating),comment:values.comment.trim()});save();closeModal();render();notify('Cảm ơn bạn đã gửi đánh giá.');}});
    document.addEventListener('click',event=>{const bookButton=event.target.closest('[data-action="book"]');if(bookButton)selectedRoomId=bookButton.dataset.room;},true);
    document.addEventListener('submit',event=>{if(event.target.id==='booking-form')event.target.dataset.room=selectedRoomId;},true);
    let showLogin = false;
    let siteSearch = {checkIn:isoDate(1),checkOut:isoDate(2),guests:2};
    let siteFiltered = false;
    let showAllServices = false;
    let reviewsExpanded = false;

    function renderWebsite(){
      const available=data.rooms.filter(room=>room.status==='available');
      const filtered=siteFiltered?available.filter(room=>room.capacity>=Number(siteSearch.guests||1)):available;
      const photos=[
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=85'
      ];
      const services=showAllServices?data.services:data.services.slice(0,4);
      document.getElementById('app').innerHTML=`<main class="hotel-site">
        <header class="site-nav"><a class="site-brand" href="#home"><span class="brand-mark">L</span><span class="brand">LUMIÈRE<small>HOTEL · DA NANG</small></span></a><nav class="site-links"><a href="#rooms">Phòng nghỉ</a><a href="#experience">Trải nghiệm</a><a href="#reviews">Đánh giá</a><button class="site-staff" data-action="show-login">Đăng Nhập</button></nav></header>
        <section class="site-hero" id="home"><img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2200&q=90" alt="Không gian nghỉ dưỡng tại Lumière Hotel" fetchpriority="high"><div class="hero-mark">L</div><div class="hero-copy"><span class="eyebrow">Một chốn nghỉ bên sông</span><h1>Lumière Hotel</h1><p>Khoảng lặng tinh tế giữa nhịp sống Đà Nẵng. Chọn căn phòng cho kỳ nghỉ tiếp theo của bạn.</p></div></section>
        <form class="site-booking" id="site-booking"><label>Nhận phòng<input name="checkIn" type="date" min="${isoDate(0)}" value="${escapeHtml(siteSearch.checkIn)}" required></label><label>Trả phòng<input name="checkOut" type="date" min="${isoDate(1)}" value="${escapeHtml(siteSearch.checkOut)}" required></label><label>Số khách<select name="guests">${[1,2,3,4].map(count=>`<option value="${count}" ${Number(siteSearch.guests)===count?'selected':''}>${count} khách</option>`).join('')}</select></label><button>Tìm phòng phù hợp</button></form>
        <div class="site-strip"><span><b>✳</b> Nghỉ dưỡng tinh tế</span><span><b>⌂</b> Phòng cho mọi hành trình</span><span><b>✦</b> Chăm chút từng trải nghiệm</span></div>
        <section class="site-section" id="rooms"><div class="site-section-head"><div><span class="eyebrow">Không gian lưu trú</span><h2>${siteFiltered?'Phòng phù hợp với bạn':'Chọn căn phòng của riêng mình'}</h2></div><p>${siteFiltered?`Phòng còn trống cho ${siteSearch.guests} khách, từ ${siteSearch.checkIn} đến ${siteSearch.checkOut}.`:'Mỗi căn phòng là một cách khác nhau để chậm lại, nghỉ ngơi và tận hưởng thành phố.'}</p></div><div class="site-room-grid">${filtered.length?filtered.map((room,index)=>`<article class="site-room"><img src="${photos[index%photos.length]}" alt="${escapeHtml(room.type)} tại Lumière Hotel" loading="lazy"><div class="site-room-body"><div class="site-room-top"><h3>${escapeHtml(room.type)}</h3><span class="badge">Còn phòng</span></div><p>${escapeHtml(room.features||'Không gian nghỉ dưỡng tiện nghi')} · ${escapeHtml(room.beds)} · tối đa ${room.capacity} khách</p><div class="site-room-price">${money(room.price)} <small>/ đêm</small></div><button class="primary" data-action="book" data-room="${escapeHtml(room.id)}">Xem phòng & đặt</button></div></article>`).join(''):'<div class="site-empty">Chưa có phòng phù hợp với số khách đã chọn. Thử điều chỉnh tìm kiếm hoặc chat với Lumière AI để được gợi ý.</div>'}</div></section>
        <section class="site-story" id="experience"><img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1300&q=85" alt="Không gian thư giãn của khách sạn" loading="lazy"><div class="site-story-copy"><span class="eyebrow">Chạm vào nhịp nghỉ riêng</span><h2>Để mỗi ngày trôi qua thật nhẹ nhàng.</h2><p>Từ bữa sáng thong thả đến những dịch vụ chăm sóc chu đáo, đội ngũ Lumière tạo nên không gian để bạn dành trọn thời gian cho điều mình yêu thích.</p><button class="secondary" data-site-scroll="services">Khám phá dịch vụ ↓</button></div></section>
        <section class="site-section" id="services"><div class="site-section-head"><div><span class="eyebrow">Thêm vào kỳ nghỉ</span><h2>Những điều nhỏ, niềm vui lớn</h2></div><p>Chọn thêm trải nghiệm phù hợp ngay trong quá trình đặt phòng.</p></div><div class="site-service-list">${services.map(service=>`<article class="site-service"><span class="service-icon">${escapeHtml(service.icon||'✦')}</span><strong>${escapeHtml(service.name)}</strong><small>${escapeHtml(service.category)} · ${money(service.price)} ${escapeHtml(service.unit)}</small></article>`).join('')}</div>${data.services.length>4?`<button class="text-button" data-action="toggle-services" style="margin-top:18px">${showAllServices?'Thu gọn dịch vụ':'Xem tất cả dịch vụ'}</button>`:''}</section>
        <section class="site-review-section" id="reviews"><div class="site-review-heading"><div><span class="eyebrow">Đánh giá từ khách lưu trú · dữ liệu demo</span><h2>Những câu chuyện sau kỳ nghỉ.</h2></div><div class="site-review-summary"><strong>${data.reviews.length?(data.reviews.reduce((sum,review)=>sum+Number(review.rating||0),0)/data.reviews.length).toFixed(1):'0.0'}</strong><span class="rating">★★★★★</span><span>${data.reviews.length} đánh giá</span></div></div><div class="site-review-grid ${reviewsExpanded?'is-expanded':'is-collapsed'}" id="site-review-list">${data.reviews.map(review=>`<article class="site-review-card"><div class="rating">${'★'.repeat(Math.max(0,Math.min(5,Number(review.rating)||0)))}${'☆'.repeat(5-Math.max(0,Math.min(5,Number(review.rating)||0)))}</div><p>“${escapeHtml(review.comment)}”</p><div class="site-review-author"><strong>${escapeHtml(review.guest)}</strong><small>Khách lưu trú Lumière Hotel</small></div></article>`).join('')}</div>${data.reviews.length>3?`<button class="site-review-toggle" type="button" data-action="toggle-reviews" aria-controls="site-review-list" aria-expanded="${reviewsExpanded}">${reviewsExpanded?'Thu gọn đánh giá':`Xem tất cả ${data.reviews.length} đánh giá`}</button>`:''}</section>
        <section class="site-contact"><div><span class="eyebrow">Kỳ nghỉ tiếp theo bắt đầu từ đây</span><h2>Hẹn gặp bạn tại Lumière.</h2><p>Chọn phòng hoặc trò chuyện với trợ lý để tìm lựa chọn phù hợp.</p></div><button class="primary" data-site-scroll="rooms">Khám phá phòng</button></section>
        <footer class="site-footer"><span>LUMIÈRE HOTEL · DA NANG<br><span style="color:#99b0a5">Một chốn nghỉ bên sông.</span></span><span>Bản demo quản lý khách sạn</span><button data-action="show-login">Đăng Nhập</button></footer>
      </main>${renderChat()}`;
    }

    function render(){
      if(!data.session){if(showLogin)renderAuth();else renderWebsite();return;}
      const nav=navItems();if(!nav.some(item=>item[0]===page))page='dashboard';
      document.getElementById('app').innerHTML=`<div class="app-shell"><aside class="sidebar" id="sidebar"><div class="brand"><span class="brand-mark">L</span><span>LUMIÈRE<small>HOTEL MANAGEMENT</small></span></div><span class="nav-label">Không gian làm việc</span><nav class="nav-list">${nav.map(([id,icon,label])=>`<button data-page="${id}" class="${page===id?'active':''}"><span class="nav-symbol">${icon}</span>${label}</button>`).join('')}</nav><div class="side-bottom"><div class="row"><span class="avatar">${escapeHtml(data.session.name.slice(0,1))}</span><span><strong>${escapeHtml(data.session.name)}</strong><br><span class="muted">${roleName(data.session.role)}</span></span></div><button class="text-button" data-action="logout" style="margin-top:13px">Đăng xuất</button></div></aside><main class="main-area"><header class="topbar"><div class="row"><button class="icon-button mobile-menu" data-action="menu" aria-label="Mở menu">☰</button><button class="text-button" data-action="site-home">Lumière Hotel ↗</button><span class="topbar-title">/ ${pageTitle[page]}</span></div><div class="top-actions"><button class="icon-button" data-action="notifications" aria-label="Thông báo">♧</button><span class="user-chip"><span class="avatar">${escapeHtml(data.session.name.slice(0,1))}</span><span>${escapeHtml(data.session.name)}</span></span></div></header><section class="page-wrap">${renderPage()}</section></main></div>${renderChat()}`;
    }

    function renderChat(){
      const publicVisitor=!data.session;
      const title=publicVisitor?'Hỏi về phòng và trải nghiệm':isAdmin()?'Hỗ trợ báo cáo và vận hành':'Tư vấn phòng, giá và dịch vụ';
      const welcome=publicVisitor?'Xin chào! Tôi có thể giúp bạn tìm phòng, chọn dịch vụ hoặc trả lời câu hỏi về kỳ nghỉ tại Lumière.':isAdmin()?'Xin chào. Tôi có thể tra cứu doanh thu, tình trạng phòng, đặt phòng và dịch vụ từ dữ liệu demo.':`Xin chào ${data.session.name.split(' ').pop()}! Tôi có thể tìm phòng phù hợp, kiểm tra giá, dịch vụ, đánh giá và lịch đặt của bạn.`;
      if(!chatMessages.length)chatMessages=[{from:'ai',text:welcome}];
      const suggestions=publicVisitor?['Phòng dưới 2 triệu','Dịch vụ có gì?','Cách đặt phòng?']:isAdmin()?['Báo cáo doanh thu','Phòng nào đang trống?','Đặt phòng chờ xác nhận']:['Gợi ý phòng dưới 3 triệu cho 3 người','Dịch vụ dưới 500 nghìn','Lịch đặt của tôi'];
      return `<div class="chat-wrap">${chatOpen?`<section class="chat-panel"><header class="chat-head"><div><strong>Lumière AI</strong><small>${title} · Trợ lý dữ liệu</small></div><button data-action="chat-close" aria-label="Đóng chat">×</button></header><div class="chat-log" id="chat-log">${chatMessages.map(message=>`<div class="chat-message ${message.from}">${escapeHtml(message.text)}</div>`).join('')}</div><div class="suggestions">${suggestions.map(text=>`<button data-question="${escapeHtml(text)}">${escapeHtml(text)}</button>`).join('')}</div><form id="chat-form" class="chat-form"><input name="question" placeholder="Nhập câu hỏi..." aria-label="Nhập câu hỏi cho Lumière AI" autocomplete="off"><button aria-label="Gửi câu hỏi">Gửi</button></form></section>`:`<button class="chat-toggle" data-action="chat-open"><span>✦</span>Lumière AI</button>`}</div>`;
    }

    function parseBudget(text){
      const normalized=normalize(text);
      const match=normalized.match(/(?:duoi|toi da|ngan sach|khong qua|khoang|tam)\s*(\d+(?:[.,]\d+)?)\s*(trieu|tr|nghin|ngan|k|vnd|dong)?|(?:^|\s)(\d+(?:[.,]\d+)?)\s*(trieu|tr|nghin|ngan|k|vnd|dong)\b/);
      if(!match)return null;
      const value=Number((match[1]||match[3]).replace(',','.'));
      const unit=match[2]||match[4]||'';
      if(unit==='trieu'||unit==='tr')return value*1000000;
      if(unit==='nghin'||unit==='ngan'||unit==='k')return value*1000;
      if(unit==='vnd'||unit==='dong')return value;
      return value>=1000?value:null;
    }

    function answerQuestion(question){
      const q=normalize(question);
      const userBookings=data.session?data.bookings.filter(booking=>booking.email===data.session.email):[];
      const available=data.rooms.filter(room=>room.status==='available');
      const budget=parseBudget(question);
      const guestMatch=q.match(/(\d+)\s*(?:khach|nguoi)/);
      const guestCount=guestMatch?Number(guestMatch[1]):null;
      const total=data.bookings.reduce((sum,booking)=>sum+Number(booking.amount||0),0);
      const paid=data.bookings.filter(booking=>booking.paid).reduce((sum,booking)=>sum+Number(booking.amount||0),0);
      const serviceTotal=data.bookings.reduce((sum,booking)=>sum+(booking.services||[]).reduce((value,service)=>value+Number(service.price||0),0),0);
      const roomTotal=total-serviceTotal;
      const greetingName=data.session?.name.split(' ').pop()||'bạn';
      if(/^(xin chao|chao|hello|hi|hey|alo)( lumiere)?$/.test(q))return `Xin chào ${greetingName}! Bạn muốn tìm phòng, xem giá, dịch vụ hay hỏi về cách đặt phòng?`;
      if(q.includes('thuat toan')||q.includes('ai hoat dong')||q.includes('cach ai')||q.includes('ban la ai'))return 'Tôi là trợ lý quy tắc dùng dữ liệu demo tại chỗ, không gửi câu hỏi ra dịch vụ bên ngoài. Tôi có thể tra phòng, giá, sức chứa, tiện nghi, dịch vụ, đánh giá và đặt phòng; câu hỏi ngoài phạm vi sẽ được báo rõ.';
      if(isAdmin()&&(/doanh thu|doanh so|cong no|da thu|bao cao/.test(q))){if(q.includes('dich vu'))return `Tổng tiền dịch vụ đính kèm đặt phòng hiện có là ${money(serviceTotal)}. Bảng giá: ${data.services.map(service=>`${service.name} ${money(service.price)}`).join('; ')}.`;if(q.includes('tien phong'))return `Tổng giá trị đặt phòng hiện tại là ${money(total)}, gồm tiền phòng ước tính ${money(roomTotal)} và tiền dịch vụ đã ghi nhận ${money(serviceTotal)}.`;return `Tổng giá trị đặt phòng ${money(total)}, đã thanh toán ${money(paid)}, còn phải thu ${money(total-paid)} trên ${data.bookings.length} lượt đặt. Đây là số liệu demo.`;}
      if(isAdmin()&&(/cong suat|phong dang o|tinh trang phong/.test(q)))return `Hiện có ${available.length} phòng sẵn sàng, ${data.rooms.filter(room=>room.status==='occupied').length} phòng đang có khách, ${data.rooms.filter(room=>room.status==='cleaning').length} phòng đang dọn và ${data.rooms.filter(room=>room.status==='maintenance').length} phòng bảo trì.`;
      if(q.includes('lich dat cua toi')||q.includes('dat phong cua toi')||q.includes('booking cua toi'))return userBookings.length?`Bạn có ${userBookings.length} lượt đặt: ${userBookings.map(booking=>`${booking.id}, phòng ${booking.room}, ${booking.checkIn} đến ${booking.checkOut}, trạng thái ${booking.status}`).join('; ')}.`:'Tôi chưa thấy lượt đặt gắn với tài khoản này. Bạn có thể tra cứu bằng email đã dùng khi đặt.';
      if(q.includes('danh gia')||q.includes('nhan xet')||q.includes('review')){const average=data.reviews.length?(data.reviews.reduce((sum,review)=>sum+Number(review.rating||0),0)/data.reviews.length).toFixed(1):'0.0';return data.reviews.length?`Khách lưu trú đánh giá Lumière ${average}/5 từ ${data.reviews.length} lượt. Nhận xét gần nhất: “${data.reviews[0].comment}”`:'Hiện chưa có đánh giá nào.';}
      if(q.includes('dich vu')||q.includes('massage')||q.includes('buffet')||q.includes('giat ui')||q.includes('don san bay')){const matches=data.services.filter(service=>!budget||service.price<=budget);return matches.length?`Dịch vụ${budget?` đến ${money(budget)}`:''}: ${matches.map(service=>`${service.name} ${money(service.price)} ${service.unit}`).join('; ')}.`:'Chưa có dịch vụ phù hợp mức giá đó.';}
      if(q.includes('gia')||q.includes('bao nhieu')||q.includes('chi phi')||q.includes('ngan sach')||budget||guestCount){const matches=available.filter(room=>(!budget||room.price<=budget)&&(!guestCount||room.capacity>=guestCount)&&(!q.includes('giuong don')||normalize(room.beds).includes('giuong don'))&&(!q.includes('giuong doi')||normalize(room.beds).includes('giuong doi')));return matches.length?`Phòng còn trống phù hợp${guestCount?` ${guestCount} khách`:''}${budget?` với ngân sách ${money(budget)}/đêm`:''}: ${matches.map(room=>`${room.type} (${room.id}), ${money(room.price)}/đêm, tối đa ${room.capacity} khách`).join('; ')}.`:budget||guestCount?'Chưa có phòng trống đáp ứng đủ ngân sách và số khách. Bạn có thể tăng ngân sách hoặc giảm số khách.':available.length?`Giá phòng trống từ ${money(Math.min(...available.map(room=>room.price)))} đến ${money(Math.max(...available.map(room=>room.price)))}/đêm.`:'Hiện chưa có phòng sẵn sàng.';}
      if(q.includes('phong')||q.includes('room'))return available.length?`Đang có ${available.length} phòng trống: ${available.map(room=>`${room.type} (${room.id}), ${money(room.price)}/đêm, tối đa ${room.capacity} khách`).join('; ')}.`:'Hiện chưa có phòng sẵn sàng.';
      if(q.includes('dat phong')||q.includes('huy phong')||q.includes('huy dat'))return 'Bạn có thể chọn ngày ở trên trang, chọn một phòng còn trống rồi điền thông tin liên hệ để gửi yêu cầu đặt. Nếu đã đăng nhập, lịch đặt sẽ được lưu trong tài khoản.';
      if(q.includes('check in')||q.includes('check out')||q.includes('nhan phong')||q.includes('tra phong'))return 'Bạn chọn ngày nhận và trả phòng trong biểu mẫu tìm phòng. Bản demo chưa công bố giờ nhận/trả phòng hoặc chính sách phụ phí, nên tôi không tự suy đoán.';
      if(q.includes('tai khoan')||q.includes('mat khau')||q.includes('quen mat khau'))return 'Bạn có thể đặt phòng với thông tin liên hệ mà không cần tạo tài khoản. Nhân viên có thể đăng nhập qua nút Khu vực nhân viên; khôi phục mật khẩu hiện chỉ mô phỏng.';
      if(q.includes('cam on')||q.includes('xin loi'))return 'Rất vui được hỗ trợ. Bạn cứ hỏi về phòng, giá, dịch vụ hoặc cách đặt nhé.';
      return 'Tôi chưa tìm thấy dữ liệu cho câu hỏi này. Tôi hỗ trợ tra cứu phòng trống, giá và ngân sách, sức chứa, dịch vụ, đánh giá, đặt phòng và chính sách được khai báo trong demo. Hãy thử hỏi cụ thể hơn.';
    }

    function sendChat(question){const text=String(question||'').trim();if(!text)return;chatMessages.push({from:'user',text},{from:'ai',text:answerQuestion(text)});chatMessages=chatMessages.slice(-24);chatOpen=true;render();const log=document.getElementById('chat-log');if(log)log.scrollTop=log.scrollHeight;}

    function bookRoom(roomId){
      const room=data.rooms.find(item=>item.id===roomId);
      if(!room||room.status!=='available')return;
      selectedRoomId=room.id;
      const contactFields=data.session?'':`<label class="field">Họ và tên<input name="guestName" required autocomplete="name"></label><label class="field">Email liên hệ<input name="guestEmail" type="email" required autocomplete="email"></label><label class="field">Số điện thoại<input name="guestPhone" type="tel" autocomplete="tel"></label>`;
      openModal('Gửi yêu cầu đặt phòng',`<form id="booking-form"><div class="notice" style="margin-bottom:14px">${escapeHtml(room.type)} · ${money(room.price)} mỗi đêm · tối đa ${room.capacity} khách</div><div class="form-grid">${contactFields}<label class="field">Ngày nhận phòng<input name="checkIn" type="date" required min="${isoDate(0)}" value="${escapeHtml(siteSearch.checkIn||isoDate(1))}"></label><label class="field">Ngày trả phòng<input name="checkOut" type="date" required min="${isoDate(1)}" value="${escapeHtml(siteSearch.checkOut||isoDate(2))}"></label><label class="field">Số khách<input name="guests" type="number" min="1" max="${room.capacity}" value="${Math.min(Number(siteSearch.guests||1),room.capacity)}" required></label><div class="field wide">Dịch vụ thêm${data.services.map((service,index)=>`<label class="check-row"><input type="checkbox" name="service" value="${index}"> ${escapeHtml(service.name)} · ${money(service.price)}</label>`).join('')}</div></div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Đóng</button><button class="primary">Gửi yêu cầu</button></div></form>`);
    }

    document.addEventListener('click',event=>{
      const loginButton=event.target.closest('[data-action="show-login"]');
      if(loginButton){event.preventDefault();showLogin=true;authMode='login';renderAuth();return;}
      const homeButton=event.target.closest('[data-action="site-home"]');
      if(homeButton){data.session=null;save();showLogin=false;page='dashboard';render();return;}
      const scrollButton=event.target.closest('[data-site-scroll]');
      if(scrollButton){document.getElementById(scrollButton.dataset.siteScroll)?.scrollIntoView({behavior:'smooth'});return;}
      const serviceToggle=event.target.closest('[data-action="toggle-services"]');
      if(serviceToggle){showAllServices=!showAllServices;renderWebsite();document.getElementById('services')?.scrollIntoView();}
      const reviewToggle=event.target.closest('[data-action="toggle-reviews"]');
      if(reviewToggle){reviewsExpanded=!reviewsExpanded;renderWebsite();document.getElementById('reviews')?.scrollIntoView({behavior:'smooth',block:'start'});}
    },true);

    document.addEventListener('submit',event=>{
      if(event.target.id==='site-booking'){
        event.preventDefault();event.stopImmediatePropagation();
        const values=Object.fromEntries(new FormData(event.target).entries());
        if(new Date(values.checkOut)<=new Date(values.checkIn)){notify('Ngày trả phòng phải sau ngày nhận phòng.');return;}
        siteSearch={checkIn:values.checkIn,checkOut:values.checkOut,guests:Number(values.guests)};siteFiltered=true;renderWebsite();document.getElementById('rooms')?.scrollIntoView({behavior:'smooth'});return;
      }
      if(event.target.id==='booking-form'){
        event.preventDefault();event.stopImmediatePropagation();
        const form=event.target;const values=Object.fromEntries(new FormData(form).entries());
        const room=data.rooms.find(item=>item.id===selectedRoomId);
        if(!room||room.status!=='available'){notify('Phòng này vừa không còn sẵn sàng.');closeModal();render();return;}
        if(new Date(values.checkOut)<=new Date(values.checkIn)){notify('Ngày trả phòng phải sau ngày nhận phòng.');return;}
        const nights=Math.max(1,Math.round((new Date(values.checkOut)-new Date(values.checkIn))/86400000));
        const selected=[...form.querySelectorAll('input[name="service"]:checked')].map(input=>data.services[Number(input.value)]).filter(Boolean);
        const guestName=data.session?.name||String(values.guestName||'').trim();
        const guestEmail=data.session?.email||String(values.guestEmail||'').trim();
        if(!guestName||!guestEmail){notify('Vui lòng nhập tên và email liên hệ.');return;}
        data.bookings.unshift({id:`BK-${Date.now().toString().slice(-6)}`,room:room.id,type:room.type,guest:guestName,email:guestEmail,phone:values.guestPhone||'',checkIn:values.checkIn,checkOut:values.checkOut,guests:Number(values.guests),amount:room.price*nights+selected.reduce((sum,service)=>sum+service.price,0),status:'Chờ xác nhận',services:selected,paid:false});
        room.status='occupied';
        for(const service of selected)data.requests.unshift({id:`YC-${Date.now().toString().slice(-4)}`,bookingId:data.bookings[0].id,guest:guestName,room:room.id,title:service.name,detail:`Khách đặt dịch vụ ${service.name}.`,status:'Chờ tiếp nhận'});
        save();closeModal();if(data.session){page='bookings';render();}else renderWebsite();notify('Đã gửi yêu cầu đặt phòng. Nhân viên sẽ liên hệ xác nhận.');
      }
    },true);

    document.addEventListener('click',event=>{
      const logoutButton=event.target.closest('[data-action="logout"]');
      if(!logoutButton)return;
      event.preventDefault();event.stopImmediatePropagation();
      data.session=null;save();showLogin=false;page='dashboard';chatMessages=[];render();
    },true);
    const liveDateFormat=new Intl.DateTimeFormat('vi-VN',{weekday:'long',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});
    function updateLiveDetails(){
      const now=liveDateFormat.format(new Date());
      const siteNav=document.querySelector('.site-links');
      const appActions=document.querySelector('.top-actions');
      const authBox=document.querySelector('.auth-box');
      let clock=document.querySelector('.site-live-clock');
      if(siteNav&&!clock){clock=document.createElement('time');clock.className='site-live-clock';siteNav.prepend(clock);}
      clock=document.querySelector('.app-live-clock');
      if(appActions&&!clock){clock=document.createElement('time');clock.className='app-live-clock';appActions.prepend(clock);}
      clock=document.querySelector('.auth-live-clock');
      if(authBox&&!clock){clock=document.createElement('time');clock.className='auth-live-clock muted';clock.style.display='block';clock.style.fontSize='11px';clock.style.marginTop='15px';authBox.append(clock);}
      for(const element of document.querySelectorAll('.site-live-clock,.app-live-clock,.auth-live-clock')){element.dateTime=new Date().toISOString();element.textContent=now;}
      const hotlineText=`Hotline khách sạn: ${HOTEL_HOTLINE}${HOTEL_HOTLINE_IS_PLACEHOLDER?' (số demo)':''}`;
      const footer=document.querySelector('.site-footer');
      if(footer&&!footer.querySelector('.site-hotline')){const link=document.createElement('a');link.className='site-hotline';link.href=`tel:${HOTEL_HOTLINE.replace(/\D/g,'')}`;link.textContent=hotlineText;footer.append(link);}
      if(authBox&&!authBox.querySelector('.auth-hotline')){const link=document.createElement('a');link.className='auth-hotline';link.href=`tel:${HOTEL_HOTLINE.replace(/\D/g,'')}`;link.textContent=hotlineText;authBox.append(link);}
    }
    const servicePhotos={
      'Ẩm thực':'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=320&q=80',
      'Di chuyển':'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=320&q=80',
      'Wellness':'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=320&q=80',
      'Tiện ích':'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=320&q=80',
      'Trải nghiệm':'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=320&q=80',
      'Khám phá':'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=320&q=80',
      'Giải trí':'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=320&q=80'
    };
    const serviceImage=service=>service.image||servicePhotos[service.category]||servicePhotos['Trải nghiệm'];
    function canReplyToReviews(){
      if(isAdmin())return true;
      if(data.session?.role!=='staff')return false;
      const staff=findStaffRecord(data.session.email);
      return Boolean(staff?.active&&(staff.permissions||[]).includes('review-reply'));
    }
    function persistChanges(){
      syncDemoState();
      const savedData=JSON.stringify({...data,session:null});
      try{
        localStorage.setItem(STORE_KEY,savedData);
        if(data.session)localStorage.setItem(SESSION_KEY,JSON.stringify(data.session));
        else localStorage.removeItem(SESSION_KEY);
        return true;
      }catch{
        notify('Không lưu được thay đổi. Hãy chọn ảnh nhỏ hơn hoặc giảm bớt ảnh đã tải lên.');
        return false;
      }
    }
    function compressImageFile(file){
      return new Promise((resolve,reject)=>{
        if(!file||!file.type.startsWith('image/')){reject(new Error('Vui lòng chọn một tệp ảnh.'));return;}
        if(file.size>12*1024*1024){reject(new Error('Ảnh gốc phải nhỏ hơn 12 MB.'));return;}
        const reader=new FileReader();
        reader.onerror=()=>reject(new Error('Không đọc được tệp ảnh.'));
        reader.onload=()=>{
          const image=new Image();
          image.onerror=()=>reject(new Error('Tệp ảnh không hợp lệ.'));
          image.onload=()=>{
            const scale=Math.min(1,1000/Math.max(image.naturalWidth,image.naturalHeight));
            const canvas=document.createElement('canvas');
            canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));
            canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
            const context=canvas.getContext('2d');
            context.fillStyle='#ffffff';context.fillRect(0,0,canvas.width,canvas.height);
            context.drawImage(image,0,0,canvas.width,canvas.height);
            let result=canvas.toDataURL('image/jpeg',0.76);
            if(result.length>600000){
              const smaller=document.createElement('canvas');
              smaller.width=Math.max(1,Math.round(canvas.width*0.7));
              smaller.height=Math.max(1,Math.round(canvas.height*0.7));
              smaller.getContext('2d').drawImage(canvas,0,0,smaller.width,smaller.height);
              result=smaller.toDataURL('image/jpeg',0.65);
            }
            resolve(result);
          };
          image.src=reader.result;
        };
        reader.readAsDataURL(file);
      });
    }
    function addImagePicker(formId,fieldName,label,currentImage,avatar=false){
      const form=document.getElementById(formId);
      if(!form||form.querySelector(`[data-image-field="${fieldName}"]`))return;
      const hidden=document.createElement('input');hidden.type='hidden';hidden.name=fieldName;hidden.value=currentImage||'';hidden.dataset.imageField=fieldName;
      const wrapper=document.createElement('div');wrapper.className='media-control';
      const pickerLabel=document.createElement('label');pickerLabel.textContent=`${label} · chọn tệp ảnh`;
      const picker=document.createElement('input');picker.type='file';picker.accept='image/*';picker.dataset.imageUpload='true';picker.setAttribute('aria-label',label);
      pickerLabel.append(picker);
      const clear=document.createElement('button');clear.type='button';clear.className='media-clear';clear.dataset.clearImage=fieldName;clear.textContent='Bỏ ảnh';
      const preview=document.createElement('img');preview.className=`media-preview${avatar?' avatar-preview':''}`;preview.alt=`Xem trước ${label}`;preview.hidden=!currentImage;
      if(currentImage)preview.src=currentImage;
      const help=document.createElement('small');help.className='media-help';help.textContent='Ảnh được thu nhỏ và lưu trên trình duyệt này.';
      wrapper.append(pickerLabel,clear,preview,help,hidden);
      const before=form.querySelector('.modal-actions')||form.lastElementChild;
      form.insertBefore(wrapper,before);
      picker.addEventListener('change',async()=>{
        const file=picker.files?.[0];if(!file)return;
        try{const image=await compressImageFile(file);hidden.value=image;preview.src=image;preview.hidden=false;}
        catch(error){notify(error.message);picker.value='';}
      });
    }
    const originalShowRoomForm=showRoomForm;
    showRoomForm=function(room){originalShowRoomForm(room);addImagePicker('room-form','image','Ảnh phòng',room?.image||'');};
    const originalShowServiceForm=showServiceForm;
    showServiceForm=function(service){originalShowServiceForm(service);addImagePicker('service-form','image','Ảnh dịch vụ',service?.image||'');};
    const originalShowStaffForm=showStaffForm;
    showStaffForm=function(){originalShowStaffForm();addImagePicker('staff-form','avatar','Ảnh đại diện','',true);};
    const originalRender=render;
    render=function(){
      originalRender();
      if(data.session){
        const account=data.users.find(user=>user.email===data.session.email);
        const image=data.session.avatar||account?.avatar;
        for(const avatar of document.querySelectorAll('.sidebar .avatar,.user-chip .avatar')){
          if(image){avatar.innerHTML=`<img class="user-avatar-image" alt="Ảnh đại diện" src="${escapeHtml(image)}">`;avatar.classList.add('has-photo');}
          else{avatar.textContent=data.session.name.slice(0,1);avatar.classList.remove('has-photo');}
        }
      }
      if(page==='settings'&&data.session){
        const account=data.users.find(user=>user.email===data.session.email);
        addImagePicker('settings-form','avatar','Ảnh đại diện',data.session.avatar||account?.avatar||'',true);
      }
      document.querySelectorAll('.room-art img').forEach(image=>image.addEventListener('error',()=>image.remove(),{once:true}));
    };
    const defaultRoomPhotos=[
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80'
    ];
    const roomPhoto=room=>room.image||defaultRoomPhotos[(Number(String(room.id||'').replace(/\D/g,''))||0)%defaultRoomPhotos.length];
    roomCard=function(room){
      const available=room.status==='available';
      return `<article class="room-card"><div class="room-art has-image"><img src="${escapeHtml(roomPhoto(room))}" alt="Ảnh ${escapeHtml(room.type)}" loading="lazy"><span>${escapeHtml(room.type)}</span><span class="badge ${statusClass(room.status)}">${roomStatus(room.status)}</span></div><div class="room-body"><h3>${escapeHtml(room.id)} <span class="muted">· ${escapeHtml(room.floor)}</span></h3><div class="room-meta">${escapeHtml(room.beds)} · tối đa ${room.capacity} khách<br>${escapeHtml(room.features||'')}</div><div class="room-price">${money(room.price)} <span class="muted" style="font-size:10px;font-weight:400">/ đêm</span></div><div class="room-actions">${data.session.role==='guest'?(available?`<button class="primary" data-action="book" data-room="${escapeHtml(room.id)}">Đặt phòng</button>`:'<button class="secondary" disabled>Chưa sẵn sàng</button>'):isAdmin()?`<select aria-label="Trạng thái phòng" data-room-status="${escapeHtml(room.id)}">${Object.entries({available:'Sẵn sàng',occupied:'Đang ở',cleaning:'Đang dọn',maintenance:'Bảo trì'}).map(([key,label])=>`<option value="${key}" ${room.status===key?'selected':''}>${label}</option>`).join('')} </select><button class="secondary" data-action="edit-room" data-room="${escapeHtml(room.id)}">Sửa</button>`:''}</div></div></article>`;
    };
    renderServices=function(){
      return `${pageHead('Dịch vụ khách sạn','Bảng giá các tiện ích hiện có.',isAdmin()?'<button class="primary" data-action="add-service">+ Thêm dịch vụ</button>':'')}<div class="service-grid">${data.services.map(service=>`<article class="service-row"><img class="service-photo" src="${escapeHtml(serviceImage(service))}" alt="Ảnh ${escapeHtml(service.name)}" loading="lazy"><main><strong>${escapeHtml(service.name)}</strong><small>${escapeHtml(service.category)} · ${money(service.price)} ${escapeHtml(service.unit)}</small></main>${isAdmin()?`<button class="secondary" data-action="edit-service" data-name="${escapeHtml(service.name)}">Sửa</button><button class="danger" data-action="delete-service" data-name="${escapeHtml(service.name)}">Xóa</button>`:''}</article>`).join('')}</div>`;
    };
    renderStaff=function(){
      if(!isAdmin())return '<section class="panel empty">Bạn không có quyền quản lý nhân viên.</section>';
      const staff=data.users.filter(user=>user.role==='staff');
      return `${pageHead('Nhân viên','Quản lý tài khoản và quyền xử lý đánh giá của nhân viên.','<button class="primary" data-action="add-staff">+ Thêm nhân viên</button>')}<section class="panel"><div class="table-wrap"><table><thead><tr><th>Nhân viên</th><th>Email</th><th>Trả lời đánh giá</th><th>Trạng thái</th><th></th></tr></thead><tbody>${staff.map(user=>`<tr><td><div class="staff-person"><span class="staff-avatar">${user.avatar?`<img src="${escapeHtml(user.avatar)}" alt="Ảnh ${escapeHtml(user.name)}">`:escapeHtml(user.name.slice(0,1))}</span><strong>${escapeHtml(user.name)}</strong></div></td><td>${escapeHtml(user.email)}</td><td><label class="permission-check"><input type="checkbox" data-review-permission="${escapeHtml(user.email)}" ${(user.permissions||[]).includes('review-reply')?'checked':''}> Được phản hồi khách</label></td><td>${user.active?'Đang hoạt động':'Đã khóa'}</td><td><label class="file-field">Đổi ảnh<input type="file" accept="image/*" data-staff-avatar="${escapeHtml(user.email)}" aria-label="Đổi ảnh đại diện ${escapeHtml(user.name)}"></label><button class="secondary" data-action="toggle-staff" data-email="${escapeHtml(user.email)}">${user.active?'Khóa':'Mở khóa'}</button></td></tr>`).join('')}</tbody></table></div></section>`;
    };
    renderReviews=function(){
      const average=data.reviews.length?(data.reviews.reduce((sum,review)=>sum+Number(review.rating||0),0)/data.reviews.length).toFixed(1):'0.0';
      const mayReply=canReplyToReviews();
      return `${pageHead('Đánh giá','Nhận xét từ khách lưu trú.') }<section class="panel"><div class="row"><strong style="font:500 33px Georgia,serif">${average}</strong><span class="rating">★★★★★</span><span class="muted">${data.reviews.length} đánh giá</span></div></section><div class="service-grid">${data.reviews.map((review,index)=>`<article class="panel"><div class="panel-head"><strong>${escapeHtml(review.guest)}</strong><span class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span></div><p style="font-size:12px;line-height:1.7;color:var(--muted)">${escapeHtml(review.comment)}</p>${review.response?`<div class="review-reply"><strong>Phản hồi từ Lumière${review.responseBy?` · ${escapeHtml(review.responseBy)}`:''}</strong>${escapeHtml(review.response)}</div>`:''}${mayReply?`<form class="review-reply-form" data-review-index="${index}"><textarea name="response" maxlength="500" required placeholder="Viết phản hồi cho khách...">${escapeHtml(review.response||'')}</textarea><button class="primary">${review.response?'Cập nhật phản hồi':'Gửi phản hồi'}</button></form>`:''}</article>`).join('')}</div>`;
    };
    const originalNavItems=navItems;
    navItems=function(){const items=originalNavItems();if(data.session?.role==='staff'&&canReplyToReviews()&&!items.some(item=>item[0]==='reviews'))items.push(['reviews','☆','Đánh giá']);return items;};
    const originalRenderSettings=renderSettings;
    renderSettings=function(){return originalRenderSettings();};
    const originalShowRoomFormWithImage=showRoomForm;
    const originalShowServiceFormWithImage=showServiceForm;
    const originalShowStaffFormWithImage=showStaffForm;
    function readFormValues(form){return Object.fromEntries(new FormData(form).entries());}
    function commitRoomForm(values){
      const oldId=values.originalId;const oldRoom=data.rooms.find(room=>room.id===oldId);
      const room={id:values.id.trim(),type:values.type.trim(),floor:values.floor.trim(),price:Number(values.price),capacity:Number(values.capacity),beds:values.beds.trim(),features:values.features.trim(),image:values.image||'',status:oldRoom?.status||'available'};
      if(!oldId&&data.rooms.some(item=>item.id===room.id)){notify('Mã phòng đã tồn tại.');return;}
      data.rooms=oldId?data.rooms.map(item=>item.id===oldId?room:item):[...data.rooms,room];
      persistChanges();closeModal();render();notify('Đã lưu thông tin phòng và ảnh.');
    }
    function commitServiceForm(values){
      const previous=data.services.find(service=>service.name===values.originalName);
      const service={name:values.name.trim(),category:values.category.trim(),price:Number(values.price),unit:values.unit.trim(),icon:previous?.icon||'✦',image:values.image||''};
      data.services=values.originalName?data.services.map(item=>item.name===values.originalName?service:item):[...data.services,service];
      persistChanges();closeModal();render();notify('Đã lưu dịch vụ và ảnh.');
    }
    function commitProfileForm(values){
      data.session={...data.session,name:values.name.trim(),phone:values.phone.trim(),avatar:values.avatar||''};
      const user=data.users.find(item=>item.email===data.session.email);
      if(user)Object.assign(user,{name:data.session.name,phone:data.session.phone,avatar:data.session.avatar});
      persistChanges();render();notify('Đã lưu hồ sơ và ảnh đại diện.');
    }
    function commitStaffForm(values){
      const normalizedEmail=String(values.email||'').trim().toLowerCase();
      const duplicate=[...(data.users||[]),(data.staffPool||[])].flat().some(item=>String((item.email||item.id||'')).toLowerCase()===normalizedEmail);
      if(duplicate){notify('Email nhân viên đã tồn tại trong demo.');return;}
      const record={
        id:`staff-demo-${Date.now().toString().slice(-6)}`,
        name:String(values.name||'').trim(),
        email:normalizedEmail,
        role:'staff',
        active:true,
        permissions:[],
        avatar:values.avatar||'',
        note:String(values.note||'').trim()||'Nhân viên ảo · không cần tài khoản đăng nhập',
        virtual:true
      };
      data.staffPool = data.staffPool || [];
      data.staffPool.push(record);
      persistChanges();closeModal();render();notify('Đã thêm nhân viên ảo vào demo và sẵn sàng để admin phân quyền.');
    }
    function bindMediaForm(formId,saveHandler){
      const form=document.getElementById(formId);if(!form)return;
      const button=form.querySelector('.modal-actions .primary')||form.querySelector('button.primary');
      if(!button||button.dataset.mediaSaveBound)return;
      button.dataset.mediaSaveBound='true';button.type='button';
      button.addEventListener('click',async()=>{
        if(!form.reportValidity())return;
        const file=form.querySelector('input[type="file"][data-image-upload]')?.files?.[0];
        const imageField=form.querySelector('input[type="hidden"][data-image-field]');
        if(file&&imageField){try{imageField.value=await compressImageFile(file);}catch(error){notify(error.message);return;}}
        saveHandler(readFormValues(form));
      });
    }
    window.addEventListener('submit',async event=>{
      const form=event.target;
      if(!['room-form','service-form','settings-form','staff-form'].includes(form.id))return;
      event.preventDefault();event.stopImmediatePropagation();
      const values=readFormValues(form);
      const file=form.querySelector('input[type="file"][data-image-upload]')?.files?.[0];
      const imageField=form.querySelector('input[type="hidden"][data-image-field]');
      if(file){
        try{values[imageField?.name||'image']=await compressImageFile(file);}
        catch(error){notify(error.message);return;}
      }else if(imageField){values[imageField.name]=imageField.value;}
      if(form.id==='room-form')commitRoomForm(values);
      else if(form.id==='service-form')commitServiceForm(values);
      else if(form.id==='settings-form')commitProfileForm(values);
      else commitStaffForm(values);
    },true);
    window.addEventListener('submit',event=>{
      const form=event.target;
      if(!form.matches('.review-reply-form'))return;
      event.preventDefault();event.stopImmediatePropagation();
      if(!canReplyToReviews()){notify('Tài khoản chưa được cấp quyền phản hồi đánh giá.');return;}
      const review=data.reviews[Number(form.dataset.reviewIndex)];const response=new FormData(form).get('response')?.toString().trim();
      if(!review||!response)return;
      review.response=response;review.responseBy=data.session.name;review.responseAt=new Date().toISOString();
      persistChanges();render();notify('Đã lưu phản hồi đánh giá.');
    },true);
    document.addEventListener('change',async event=>{
      const input=event.target;
      if(input.matches('[data-review-permission]')){
        const user=data.users.find(item=>item.email===input.dataset.reviewPermission);
        if(!user)return;
        user.permissions=Array.isArray(user.permissions)?user.permissions:[];
        user.permissions=input.checked?[...new Set([...user.permissions,'review-reply'])]:user.permissions.filter(permission=>permission!=='review-reply');
        persistChanges();render();notify(input.checked?'Đã cấp quyền phản hồi đánh giá.':'Đã thu hồi quyền phản hồi đánh giá.');
      }
      if(input.matches('[data-staff-avatar]')&&input.files?.[0]){
        const user=findStaffRecord(input.dataset.staffAvatar);if(!user)return;
        try{user.avatar=await compressImageFile(input.files[0]);persistChanges();render();notify(user.virtual?'Đã lưu ảnh đại diện nhân viên ảo.':'Đã lưu ảnh đại diện nhân viên.');}
        catch(error){notify(error.message);}
      }
    },true);
    document.addEventListener('click',event=>{
      const clear=event.target.closest('[data-clear-image]');if(!clear)return;
      const form=clear.closest('form');const field=form?.querySelector(`[data-image-field="${clear.dataset.clearImage}"]`);const preview=form?.querySelector('.media-preview');
      if(field)field.value='';if(preview){preview.removeAttribute('src');preview.hidden=true;}
      if(event.target.closest('[data-action="notifications"]')){
        notificationsOpen = !notificationsOpen;
        render();
        return;
      }
      if(event.target.closest('[data-action="mark-notifications-read"]')){
        notificationsOpen = false;
        data.readNotifications = true;
        persistChanges();
        render();
        return;
      }
      if(!event.target.closest('.notification-popover') && !event.target.closest('.notification-button')){
        if(notificationsOpen){notificationsOpen = false; render();}
      }
    },true);
    const originalRenderForMedia=render;
    render=function(){
      originalRenderForMedia();
      if(data.session){
        const account=data.users.find(user=>user.email===data.session.email);const avatar=data.session.avatar||account?.avatar;
        for(const element of document.querySelectorAll('.sidebar .avatar,.user-chip .avatar')){
          if(avatar)element.innerHTML=`<img class="user-avatar-image" src="${escapeHtml(avatar)}" alt="Ảnh đại diện">`;
          else element.textContent=data.session.name.slice(0,1);
        }
      }
      if(page==='settings'&&data.session){addImagePicker('settings-form','avatar','Ảnh đại diện',data.session.avatar||data.users.find(user=>user.email===data.session.email)?.avatar||'',true);bindMediaForm('settings-form',commitProfileForm);}
      document.querySelectorAll('.room-art img').forEach(image=>image.addEventListener('error',()=>image.remove(),{once:true}));
      document.querySelectorAll('.service-photo').forEach(image=>image.addEventListener('error',()=>{image.style.display='none';},{once:true}));
    };
    const attachRoomImageForm=showRoomForm;showRoomForm=function(room){attachRoomImageForm(room);addImagePicker('room-form','image','Ảnh phòng',room?.image||'');bindMediaForm('room-form',commitRoomForm);};
    const attachServiceImageForm=showServiceForm;showServiceForm=function(service){attachServiceImageForm(service);addImagePicker('service-form','image','Ảnh dịch vụ',service?.image||'');bindMediaForm('service-form',commitServiceForm);};
    const attachStaffImageForm=showStaffForm;showStaffForm=function(){attachStaffImageForm();addImagePicker('staff-form','avatar','Ảnh đại diện nhân viên','',true);bindMediaForm('staff-form',commitStaffForm);};
    const attachSettingsImageForm=renderSettings;renderSettings=function(){return attachSettingsImageForm();};
    const staffAccessOptions=[
      {key:'rooms',label:'Phòng'},
      {key:'bookings',label:'Đặt phòng'},
      {key:'services',label:'Dịch vụ'},
      {key:'operations',label:'Vận hành'},
      {key:'reports',label:'Báo cáo doanh thu'},
      {key:'invoice-notifications',label:'Nhận hóa đơn'},
      {key:'review-reply',label:'Trả lời đánh giá'}
    ];
    const staffPagePermission={rooms:'rooms',bookings:'bookings',services:'services',operations:'operations',invoices:'invoice-notifications',reports:'reports',reviews:'review-reply'};
    function permissionsForStaff(user){return Array.isArray(user?.permissions)?user.permissions:[];}
    function staffCanOpen(pageId){
      if(data.session?.role!=='staff')return true;
      if(pageId==='dashboard'||pageId==='settings')return true;
      const permission=staffPagePermission[pageId];
      const user=findStaffRecord(data.session.email);
      return Boolean(permission&&user?.active&&permissionsForStaff(user).includes(permission));
    }
    const navItemsBeforePermissions=navItems;
    navItems=function(){
      const items=navItemsBeforePermissions();
      if(data.session?.role==='admin'&&!items.some(([id])=>id==='invoices')){
        const reportsIndex=items.findIndex(([id])=>id==='reports');
        items.splice(reportsIndex<0?items.length:reportsIndex,0,['invoices','▧','Hóa đơn']);
        return items;
      }
      if(data.session?.role!=='staff')return items;
      const visible=items.filter(([id])=>staffCanOpen(id));
      if(staffCanOpen('reports')&&!visible.some(([id])=>id==='reports')){
        const settingsIndex=visible.findIndex(([id])=>id==='settings');
        visible.splice(settingsIndex<0?visible.length:settingsIndex,0,['reports','↗','Doanh thu']);
      }
      if(staffCanOpen('invoices')&&!visible.some(([id])=>id==='invoices')){
        const settingsIndex=visible.findIndex(([id])=>id==='settings');
        visible.splice(settingsIndex<0?visible.length:settingsIndex,0,['invoices','▧','Hóa đơn']);
      }
      return visible;
    };
    renderStaff=function(){
      if(!isAdmin())return '<section class="panel empty">Bạn không có quyền quản lý nhân viên.</section>';
      const staff=staffDirectory();
      return `${pageHead('Nhân viên','Quản lý nhân viên demo và quyền truy cập theo vai trò.','<button class="primary" data-action="add-staff">+ Thêm nhân viên</button>')}<section class="panel staff-table"><div class="table-wrap"><table><thead><tr><th>Nhân viên</th><th>Email</th><th>Quyền truy cập</th><th>Trạng thái</th><th></th></tr></thead><tbody>${staff.map(user=>{const key=(user.email||user.id);return `<tr><td><div class="staff-person"><span class="staff-avatar">${user.avatar?`<img src="${escapeHtml(user.avatar)}" alt="Ảnh ${escapeHtml(user.name)}">`:escapeHtml(user.name.slice(0,1))}</span><strong>${escapeHtml(user.name)}</strong></div></td><td>${escapeHtml(key)}</td><td><div class="permission-panel"><strong>Chọn quyền</strong><div class="permission-grid">${staffAccessOptions.map(option=>`<label class="permission-check"><input type="checkbox" data-staff-permission="${escapeHtml(key)}" data-permission-key="${option.key}" ${permissionsForStaff(user).includes(option.key)?'checked':''}>${option.label}</label>`).join('')}</div></div></td><td><span class="badge ${user.active?'':'bad'}">${user.active?'Đang hoạt động':'Đã khóa'}</span></td><td><div class="stack"><label class="file-field">Đổi ảnh<input type="file" accept="image/*" data-staff-avatar="${escapeHtml(key)}" aria-label="Đổi ảnh đại diện ${escapeHtml(user.name)}"></label><button class="secondary" data-action="toggle-staff" data-email="${escapeHtml(key)}">${user.active?'Khóa tài khoản':'Mở khóa'}</button></div></td></tr>`;}).join('')}</tbody></table></div></section>`;
    };
    const reportsForAdmin=renderReports;
    renderReports=function(){
      if(isAdmin())return reportsForAdmin();
      if(!staffCanOpen('reports'))return '<section class="panel empty">Tài khoản chưa được cấp quyền xem báo cáo.</section>';
      const total=data.bookings.reduce((sum,booking)=>sum+Number(booking.amount||0),0);
      const paid=data.bookings.filter(booking=>booking.paid).reduce((sum,booking)=>sum+Number(booking.amount||0),0);
      return `${pageHead('Báo cáo doanh thu','Chế độ xem theo quyền nhân viên được cấp.','<div class="row"><button class="secondary" data-action="print-report">In / Xuất PDF</button></div>')}<section class="report-shell"><div class="report-head"><div><span class="eyebrow">Lumière Hotel</span><h2 style="margin:4px 0 0;font-size:24px;">Báo cáo doanh thu</h2></div><div class="report-actions"><button class="secondary" data-action="print-report">In / Xuất PDF</button></div></div><div class="stats"><article class="stat"><small>Tổng giá trị đặt phòng</small><strong>${money(total)}</strong><span>${data.bookings.length} lượt đặt</span></article><article class="stat"><small>Đã thanh toán</small><strong>${money(paid)}</strong><span>theo dữ liệu demo</span></article><article class="stat"><small>Còn phải thu</small><strong>${money(total-paid)}</strong><span>theo dữ liệu demo</span></article></div></section>`;
    };
    const bookingsForAll=renderBookings;
    renderBookings=function(){
      if(data.session?.role!=='staff')return bookingsForAll();
      if(!staffCanOpen('bookings'))return '<section class="panel empty">Tài khoản chưa được cấp quyền xem đặt phòng.</section>';
      return `${pageHead('Đặt phòng','Danh sách chỉ xem theo quyền nhân viên được cấp.')}${data.bookings.length?data.bookings.map(booking=>bookingCard(booking,false)).join(''):'<section class="panel empty">Chưa có lượt đặt phòng.</section>'}`;
    };
    function renderGuestDashboard(){
      const available=data.rooms.filter(room=>room.status==='available');
      const services=data.services.slice(0,6);
      return `<section class="guest-welcome"><div><span class="eyebrow">Lumière Hotel</span><h1>Chào mừng ${escapeHtml(data.session.name.split(' ').slice(-1)[0])}</h1><p>Khám phá những căn phòng đang sẵn sàng và các dịch vụ được chuẩn bị cho kỳ nghỉ của bạn tại Lumière.</p><div class="guest-welcome-actions"><button class="primary" data-page="rooms">Xem phòng còn trống</button><button class="secondary" data-page="services">Khám phá dịch vụ</button></div></div><div class="guest-welcome-photo"></div></section><section class="guest-section"><div class="guest-section-head"><div><h2>Phòng đang sẵn sàng</h2><p>${available.length} phòng còn trống để bạn lựa chọn.</p></div><button class="text-button" data-page="rooms">Xem tất cả</button></div><div class="guest-room-grid">${available.slice(0,3).map(roomCard).join('')}</div></section><section class="guest-section"><div class="guest-section-head"><div><h2>Dịch vụ cho kỳ nghỉ</h2><p>Những tiện ích nhỏ giúp thời gian lưu trú nhẹ nhàng hơn.</p></div><button class="text-button" data-page="services">Xem tất cả</button></div><div class="guest-service-list">${services.map(service=>`<article class="service-row"><span class="service-icon">${escapeHtml(service.icon||'✦')}</span><main><strong>${escapeHtml(service.name)}</strong><small>${escapeHtml(service.category)} · ${money(service.price)} ${escapeHtml(service.unit)}</small></main></article>`).join('')}</div></section>`;
    }
    const dashboardWithoutHero=renderDashboard;
    renderDashboard=function(){
      if(data.session?.role==='guest')return renderGuestDashboard();
      if(!isAdmin())return dashboardWithoutHero();
      const ready=data.rooms.filter(room=>room.status==='available').length;
      const upcoming=data.bookings.find(booking=>!['Đã hủy','Đã trả phòng'].includes(booking.status));
      const dashboardContent=document.createElement('div');
      dashboardContent.innerHTML=dashboardWithoutHero();
      dashboardContent.querySelector('.page-head')?.remove();
      return `<section class="dashboard-welcome"><div class="dashboard-welcome-copy"><span class="eyebrow">Không gian điều hành Lumière</span><h1>Chào ${escapeHtml(data.session.name.split(' ').slice(-1)[0])}, chúc bạn một ngày thuận lợi.</h1><p>Toàn bộ hoạt động lưu trú được sắp xếp tại một nơi, để đội ngũ chăm chút từng trải nghiệm của khách.</p><div class="dashboard-welcome-actions"><button class="primary" data-page="rooms">Quản lý phòng</button><button class="secondary" data-page="bookings">Xem đặt phòng</button></div></div><div class="dashboard-welcome-photo"><img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1100&q=85" alt="Khu nghỉ dưỡng Lumière Hotel"><div class="dashboard-welcome-count"><strong>${ready} phòng</strong><small>sẵn sàng đón khách</small></div></div></section>${dashboardContent.innerHTML}`;
    };
    const roomsForRole=renderRooms;
    renderRooms=function(){
      if(data.session?.role!=='guest')return roomsForRole();
      const available=data.rooms.filter(room=>room.status==='available');
      const query=roomSearch.toLocaleLowerCase('vi');
      const rooms=available.filter(room=>`${room.id} ${room.type} ${room.floor}`.toLocaleLowerCase('vi').includes(query));
      return `${pageHead('Phòng còn trống','Những lựa chọn đang sẵn sàng cho kỳ nghỉ của bạn.')}<div class="toolbar"><input id="room-search" value="${escapeHtml(roomSearch)}" placeholder="Tìm theo mã hoặc loại phòng"></div><div class="room-grid" id="room-grid">${rooms.length?rooms.map(roomCard).join(''):'<div class="empty">Không tìm thấy phòng còn trống phù hợp.</div>'}</div>`;
    };
    const renderForPermission=render;
    render=function(){
      if(data.session?.role==='staff'&&!staffCanOpen(page))page='dashboard';
      return renderForPermission();
    };
    document.addEventListener('change',event=>{
      const input=event.target.closest('[data-staff-permission]');
      if(!input)return;
      const user=findStaffRecord(input.dataset.staffPermission);
      if(!user)return;
      const permission=input.dataset.permissionKey;
      user.permissions=permissionsForStaff(user);
      user.permissions=input.checked?[...new Set([...user.permissions,permission])]:user.permissions.filter(item=>item!==permission);
      persistChanges();render();notify(input.checked?'Đã cấp quyền cho nhân viên.':'Đã thu hồi quyền của nhân viên.');
    },true);
    function bookingServiceAmount(service){
      if(service.lineTotal!=null)return Number(service.lineTotal)||0;
      return (Number(service.price)||0)*Math.max(1,Number(service.quantity)||1);
    }
    function invoiceRecipients(){
      return [...new Set(staffDirectory().filter(user=>user.active&&(user.role==='admin'||(user.role==='staff'&&permissionsForStaff(user).includes('invoice-notifications')))).map(user=>user.email||user.id))];
    }
    function issueInvoice(booking){
      if(booking.invoice)return booking.invoice;
      const room=data.rooms.find(item=>item.id===booking.room);
      const nights=Math.max(1,Math.round((new Date(booking.checkOut)-new Date(booking.checkIn))/86400000)||1);
      const services=(booking.services||[]).map(service=>({...service,lineTotal:bookingServiceAmount(service)}));
      const serviceTotal=services.reduce((sum,service)=>sum+service.lineTotal,0);
      const gross=Number(booking.amount)||((room?.price||0)*nights+serviceTotal);
      const roomTotal=Math.max(0,gross-serviceTotal);
      const recipients=invoiceRecipients();
      const invoice={
        number:`HD-${String(booking.id).replace(/[^0-9]/g,'').slice(-6)||Date.now().toString().slice(-6)}`,
        bookingId:booking.id,guest:booking.guest,email:booking.email,room:booking.room,roomType:booking.type,
        nights,checkIn:booking.checkIn,checkOut:booking.checkOut,roomTotal,serviceTotal,total:roomTotal+serviceTotal,
        services,paid:Boolean(booking.paid),issuedAt:new Date().toISOString(),recipients
      };
      booking.invoice=invoice;booking.status='Đã trả phòng';booking.checkedOutAt=invoice.issuedAt;
      if(room){room.status='cleaning';room.guest='';room.nights=0;}
      if(!data.requests.some(request=>request.bookingId===booking.id&&request.title==='Dọn phòng sau khi trả phòng')){
        data.requests.unshift({id:`YC-${Date.now().toString().slice(-4)}`,bookingId:booking.id,guest:booking.guest,room:booking.room,title:'Dọn phòng sau khi trả phòng',detail:'Khách đã trả phòng và hóa đơn đã phát hành; vui lòng kiểm tra phòng.',status:'Chờ tiếp nhận',type:'housekeeping'});
      }
      data.invoiceNotifications=data.invoiceNotifications||[];
      data.invoiceNotifications.unshift({id:invoice.number,bookingId:booking.id,recipients,issuedAt:invoice.issuedAt,readBy:[]});
      persistChanges();return invoice;
    }
    function invoiceMarkup(invoice){
      const serviceRows=(invoice.services||[]).map(service=>`<div class="invoice-line"><span>${escapeHtml(service.name)}${Number(service.quantity)>1?` × ${Number(service.quantity)}`:''}</span><strong>${money(service.lineTotal??bookingServiceAmount(service))}</strong></div>`).join('');
      const dateText=new Intl.DateTimeFormat('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(invoice.issuedAt));
      return `<article class="invoice-paper"><header class="invoice-brand"><div><h3>LUMIÈRE HOTEL</h3><small>HÓA ĐƠN LƯU TRÚ</small></div><div style="text-align:right"><strong>${escapeHtml(invoice.number)}</strong><br><small>${dateText}</small></div></header><div class="metric-list" style="padding:14px 0"><div class="metric-line"><span>Khách hàng</span><strong>${escapeHtml(invoice.guest)}</strong></div><div class="metric-line"><span>Phòng</span><strong>${escapeHtml(invoice.roomType)} · ${escapeHtml(invoice.room)}</strong></div><div class="metric-line"><span>Thời gian lưu trú</span><strong>${escapeHtml(invoice.checkIn)} → ${escapeHtml(invoice.checkOut)} · ${invoice.nights} đêm</strong></div></div><div class="invoice-lines"><div class="invoice-line"><span>Tiền phòng (${invoice.nights} đêm)</span><strong>${money(invoice.roomTotal)}</strong></div>${serviceRows||'<div class="invoice-line"><span>Dịch vụ</span><span>Không phát sinh</span></div>'}</div><div class="invoice-total"><span>Tổng thanh toán</span><strong>${money(invoice.total)}</strong></div><p class="invoice-note">${isAdmin()||invoice.recipients?.includes(data.session?.email)?'Hóa đơn đã được gửi đến khu Hóa đơn của quản trị viên và nhân viên được phân quyền.':'Hóa đơn điện tử của kỳ lưu trú Lumière Hotel.'}</p><div class="invoice-actions"><button type="button" class="secondary" data-action="print-invoice">In / Lưu PDF</button><button type="button" class="primary" data-action="close-modal">Đóng</button></div></article>`;
    }
    function showInvoice(booking){if(!booking?.invoice)return;openModal('Hóa đơn lưu trú',invoiceMarkup(booking.invoice));}
    function issueInvoiceAndShow(booking){
      if(!booking)return;
      if(booking.status==='Đã hủy'){notify('Không thể xuất hóa đơn cho lượt đặt đã hủy.');return;}
      const invoice=issueInvoice(booking);render();showInvoice({...booking,invoice});notify(`Đã phát hành ${invoice.number} và chuyển đến người nhận được phân quyền.`);
    }
    const originalBookingCardWithInvoice=bookingCard;
    bookingCard=function(booking,actions=true){
      let html=originalBookingCardWithInvoice(booking,actions);
      if(!actions||!data.session)return html;
      const buttons=[];
      if(data.session.role==='guest'&&booking.email===data.session.email&&booking.status==='Đang ở')buttons.push(`<button class="primary" data-action="guest-checkout" data-id="${escapeHtml(booking.id)}">Trả phòng & lấy hóa đơn</button>`);
      if(booking.invoice&&(isAdmin()||booking.email===data.session.email))buttons.push(`<button class="secondary" data-action="view-invoice" data-id="${escapeHtml(booking.id)}">Xem hóa đơn</button>`);
      return buttons.length?html.replace(/<\/article>$/,`<div class="booking-actions">${buttons.join('')}</div></article>`):html;
    };
    renderServices=function(){
      const canOrder=data.session?.role==='guest';
      return `${pageHead('Dịch vụ khách sạn','Chọn tiện ích cho kỳ lưu trú của bạn.',isAdmin()?'<button class="primary" data-action="add-service">+ Thêm dịch vụ</button>':'')}<div class="service-grid">${data.services.map(service=>`<article class="service-row"><img class="service-photo" src="${escapeHtml(serviceImage(service))}" alt="Ảnh ${escapeHtml(service.name)}" loading="lazy"><main><strong>${escapeHtml(service.name)}</strong><small>${escapeHtml(service.category)} · ${money(service.price)} ${escapeHtml(service.unit)}</small>${canOrder?`<button class="primary service-order-button" data-action="order-service" data-name="${escapeHtml(service.name)}">Đặt dịch vụ</button>`:''}</main>${isAdmin()?`<button class="secondary" data-action="edit-service" data-name="${escapeHtml(service.name)}">Sửa</button><button class="danger" data-action="delete-service" data-name="${escapeHtml(service.name)}">Xóa</button>`:''}</article>`).join('')}</div>`;
    };
    function activeGuestBookings(){return data.bookings.filter(booking=>booking.email===data.session?.email&&['Chờ xác nhận','Đã xác nhận','Đang ở'].includes(booking.status));}
    function beginServiceOrder(serviceName){
      const service=data.services.find(item=>item.name===serviceName);if(!service)return;
      const stays=activeGuestBookings();
      if(!stays.length){notify('Bạn cần có lượt đặt phòng đang hoạt động để đặt dịch vụ.');page='rooms';render();return;}
      openModal('Đặt dịch vụ',`<form id="service-order-form"><div class="notice" style="margin-bottom:14px">${escapeHtml(service.name)} · ${money(service.price)} ${escapeHtml(service.unit)}</div><div class="stack"><label class="field">Gắn với kỳ lưu trú<select name="bookingId" required>${stays.map(booking=>`<option value="${escapeHtml(booking.id)}">${escapeHtml(booking.id)} · ${escapeHtml(booking.type)} · ${escapeHtml(booking.status)}</option>`).join('')}</select></label><label class="field">Số lượng<input name="quantity" type="number" min="1" max="20" value="1" required></label><label class="field">Ghi chú<textarea name="notes" maxlength="300" placeholder="Thời gian mong muốn hoặc yêu cầu thêm"></textarea></label></div><div class="modal-actions"><button type="button" class="secondary" data-action="close-modal">Hủy</button><button class="primary">Gửi yêu cầu dịch vụ</button></div></form>`);
      document.getElementById('service-order-form').dataset.serviceName=service.name;
    }
    renderInvoices=function(){
      const bookings=data.bookings.filter(booking=>booking.invoice&&(isAdmin()||booking.invoice.recipients?.includes(data.session?.email)));
      return `${pageHead('Hóa đơn','Hóa đơn trả phòng gửi cho quản trị viên và nhân viên được phân quyền.')}${bookings.length?`<div class="stack">${bookings.map(booking=>`<article class="invoice-card"><div class="row space"><div><span class="eyebrow">${escapeHtml(booking.invoice.number)}</span><h2 style="margin:5px 0">${escapeHtml(booking.guest)} · ${escapeHtml(booking.room)}</h2><span class="muted">${escapeHtml(booking.checkIn)} → ${escapeHtml(booking.checkOut)} · ${booking.invoice.nights} đêm</span></div><strong>${money(booking.invoice.total)}</strong></div><div class="row space" style="margin-top:13px"><span class="badge ${booking.invoice.paid?'':'warn'}">${booking.invoice.paid?'Đã thanh toán':'Chờ thanh toán'}</span><div class="row">${isAdmin()?`<label class="check-row"><input type="checkbox" data-invoice-paid="${escapeHtml(booking.id)}" ${booking.invoice.paid?'checked':''}> Đã thanh toán</label>`:''}<button class="secondary" data-action="view-invoice" data-id="${escapeHtml(booking.id)}">Mở hóa đơn</button></div></div><small class="invoice-recipient">Đã phát hành ${new Intl.DateTimeFormat('vi-VN',{dateStyle:'medium',timeStyle:'short'}).format(new Date(booking.invoice.issuedAt))}</small></article>`).join('')}</div>`:'<section class="panel empty">Chưa có hóa đơn đã phát hành cho tài khoản này.</section>'}`;
    };
    function renderInvoices(){
      if(!isAdmin()&&!staffCanOpen('invoices'))return '<section class="panel empty">Tài khoản chưa được cấp quyền nhận hóa đơn.</section>';
      const bookings=data.bookings.filter(booking=>booking.invoice&&(isAdmin()||booking.invoice.recipients?.includes(data.session?.email)));
      if(!bookings.length)return `${pageHead('Hóa đơn','Hóa đơn trả phòng được chuyển tới admin và nhân viên có quyền nhận.') }<section class="panel empty">Chưa có hóa đơn đã phát hành.</section>`;
      return `${pageHead('Hóa đơn','Hóa đơn trả phòng được chuyển tới admin và nhân viên có quyền nhận.')}<div class="stack">${bookings.map(booking=>`<article class="invoice-card"><div class="row space"><div><span class="eyebrow">${escapeHtml(booking.invoice.number)}</span><h2 style="margin:5px 0">${escapeHtml(booking.guest)} · ${escapeHtml(booking.room)}</h2><span class="muted">${escapeHtml(booking.checkIn)} → ${escapeHtml(booking.checkOut)} · ${booking.invoice.nights} đêm</span></div><strong>${money(booking.invoice.total)}</strong></div><div class="row space" style="margin-top:14px"><span class="badge ${booking.invoice.paid?'':'warn'}">${booking.invoice.paid?'Đã thanh toán':'Chờ thanh toán'}</span><div class="row">${isAdmin()?`<label class="check-row"><input type="checkbox" data-invoice-paid="${escapeHtml(booking.id)}" ${booking.invoice.paid?'checked':''}> Đã thanh toán</label>`:''}<button class="secondary" data-action="view-invoice" data-id="${escapeHtml(booking.id)}">Mở hóa đơn</button></div></div><small class="invoice-recipient">Phát hành ${new Intl.DateTimeFormat('vi-VN',{dateStyle:'medium',timeStyle:'short'}).format(new Date(booking.invoice.issuedAt))}</small></article>`).join('')}</div>`;
    }
    const pageRendererBeforeInvoices=renderPage;
    renderPage=function(){return page==='invoices'?renderInvoices():pageRendererBeforeInvoices();};
    function handleCheckout(booking){
      if(!booking)return;
      if(data.session?.role==='guest'&&booking.email!==data.session.email){notify('Bạn chỉ có thể trả phòng cho kỳ lưu trú của mình.');return;}
      if(booking.status!=='Đang ở'){notify('Chỉ có thể trả phòng khi trạng thái lưu trú là Đang ở.');return;}
      issueInvoiceAndShow(booking);
    }
    function submitServiceOrder(form){
      const values=Object.fromEntries(new FormData(form).entries());
      const service=data.services.find(item=>item.name===form.dataset.serviceName);
      const booking=data.bookings.find(item=>item.id===values.bookingId&&item.email===data.session?.email);
      const quantity=Math.max(1,Number(values.quantity)||1);
      if(!service||!booking||!activeGuestBookings().some(item=>item.id===booking.id)){notify('Không tìm thấy kỳ lưu trú đang hoạt động cho yêu cầu này.');return;}
      const id=`DV-${Date.now().toString().slice(-7)}`;const total=Number(service.price)*quantity;
      const order={id,bookingId:booking.id,room:booking.room,guest:data.session.name,email:data.session.email,name:service.name,category:service.category,unitPrice:Number(service.price),quantity,total,notes:String(values.notes||'').trim(),status:'Chờ tiếp nhận',createdAt:new Date().toISOString()};
      data.serviceOrders=data.serviceOrders||[];data.serviceOrders.unshift(order);
      booking.services=Array.isArray(booking.services)?booking.services:[];
      booking.services.push({name:service.name,price:total,unitPrice:Number(service.price),quantity,unit:service.unit,lineTotal:total,serviceOrderId:id});
      booking.amount=(Number(booking.amount)||0)+total;
      data.requests.unshift({id,bookingId:booking.id,guest:data.session.name,room:booking.room,title:`${service.name} × ${quantity}`,detail:`${values.notes?`Ghi chú: ${String(values.notes).trim()}`:'Khách đặt thêm dịch vụ trong kỳ lưu trú.'}`,status:'Chờ tiếp nhận',type:'service'});
      persistChanges();closeModal();page='services';render();notify('Đã gửi yêu cầu dịch vụ; chi phí sẽ được cộng vào hóa đơn trả phòng.');
    }
    window.addEventListener('click',event=>{
      const target=event.target.closest('[data-action]');if(!target)return;
      if(target.dataset.action==='guest-checkout'||target.dataset.action==='checkout'){
        event.preventDefault();event.stopImmediatePropagation();
        handleCheckout(data.bookings.find(booking=>booking.id===target.dataset.id));return;
      }
      if(target.dataset.action==='view-invoice'){
        event.preventDefault();event.stopImmediatePropagation();
        const booking=data.bookings.find(item=>item.id===target.dataset.id);
        if(booking&&(isAdmin()||booking.email===data.session?.email||booking.invoice?.recipients?.includes(data.session?.email)))showInvoice(booking);
        return;
      }
      if(target.dataset.action==='print-report'){event.preventDefault();event.stopImmediatePropagation();document.querySelector('.report-shell')?.classList.add('is-printing');window.print();return;}
      if(target.dataset.action==='print-invoice'){event.preventDefault();event.stopImmediatePropagation();window.print();return;}
      if(target.dataset.action==='order-service'){event.preventDefault();event.stopImmediatePropagation();beginServiceOrder(target.dataset.name);}
    },true);
    window.addEventListener('change',event=>{
      const target=event.target;
      if(target.matches('[data-booking-status]')&&target.value==='Đã trả phòng'){
        event.preventDefault();event.stopImmediatePropagation();handleCheckout(data.bookings.find(booking=>booking.id===target.dataset.bookingStatus));return;
      }
      if(target.matches('[data-invoice-paid]')){
        event.preventDefault();event.stopImmediatePropagation();
        const booking=data.bookings.find(item=>item.id===target.dataset.invoicePaid);
        if(booking?.invoice){booking.invoice.paid=target.checked;booking.paid=target.checked;persistChanges();render();notify(target.checked?'Đã ghi nhận thanh toán hóa đơn.':'Hóa đơn đã chuyển về chờ thanh toán.');}
      }
    },true);
    window.addEventListener('submit',event=>{
      const form=event.target;if(form.id!=='service-order-form')return;
      event.preventDefault();event.stopImmediatePropagation();
      if(data.session?.role!=='guest'){notify('Chỉ tài khoản khách hàng mới có thể đặt dịch vụ.');return;}
      if(!form.reportValidity())return;
      submitServiceOrder(form);
    },true);
    // Luôn mở website công khai khi truy cập lại hệ thống; đăng nhập chỉ bắt đầu từ nút trên website.
    data.session=null;
    localStorage.removeItem(SESSION_KEY);
    showLogin=false;
    page='dashboard';
    render();
    updateLiveDetails();
    setInterval(updateLiveDetails,1000);
  