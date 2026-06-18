export const auditLogsData: any[] = [];
const actions = ['LOGIN', 'LOGIN_FAILED', 'CREATE', 'UPDATE', 'DELETE', 'REGISTER', 'CHANGE_PASSWORD', 'VERIFY_EMAIL'];
const resources = ['User', 'Order', 'Product', 'Role', 'Setting', 'Banner', 'Coupon'];
const users = ['admin@malmil.id', 'operator@malmil.id', 'superadmin@malmil.id'];

for (let i = 0; i < 50; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const resource = resources[Math.floor(Math.random() * resources.length)];
    const d = new Date();
    d.setHours(d.getHours() - i * 2);
    auditLogsData.push({
        id: `log-${i}`,
        userId: `user-${Math.floor(Math.random() * 3) + 1}`,
        userEmail: users[Math.floor(Math.random() * users.length)],
        action,
        resource,
        resourceId: resource === 'Order' ? `INV-2026${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}` : undefined,
        description: `${action} on ${resource}`,
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        created_at: d.toISOString(),
    });
}
